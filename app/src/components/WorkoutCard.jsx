import { useState, useEffect, useMemo } from 'react';
import {
    Lightbulb, Clock, Check, Trophy, Timer, AlertCircle, ChevronDown, History as HistoryIcon,
} from 'lucide-react';
import {
    loadSession, saveSession, readLogs, getLastEntry, formatEntry,
    isBodyweight, isTimeBased,
} from '../utils/logs';
import { loadPrefs } from '../utils/prefs';

export default function WorkoutCard({ workout, interactive = true }) {
    // Hooks must run on every render — the early return lives below them, or React
    // throws "Rendered more hooks than during the previous render" the moment a
    // null workout becomes a real one.
    const workoutId = workout?.id ?? null;
    const exercises = useMemo(() => workout?.exercises ?? [], [workout]);

    const [session, setSession] = useState(() => loadSession(workoutId, exercises));
    const [expanded, setExpanded] = useState(null);
    const [shownWorkoutId, setShownWorkoutId] = useState(workoutId);
    const unit = useMemo(() => loadPrefs().weightUnit || 'lb', []);

    // Read the log index once per card rather than per row, refreshed whenever
    // a new workout appears (a commit may have landed since the last read).
    const [logs, setLogs] = useState(() => readLogs());

    // Reload when a different workout lands in the same card slot. Adjusting
    // state during render is React's recommended alternative to a reset effect.
    if (shownWorkoutId !== workoutId) {
        setShownWorkoutId(workoutId);
        setSession(loadSession(workoutId, exercises));
        setLogs(readLogs());
        setExpanded(null);
    }

    // Persist so navigating to the timer and back doesn't wipe mid-workout entries.
    useEffect(() => {
        if (!workoutId || !interactive) return;
        saveSession(workoutId, session);
    }, [session, workoutId, interactive]);

    if (!workout) return null;

    const { header, restPeriod, insight, estimatedMinutes, totalSets } = workout;

    const setsOf = (i) => session[i]?.sets ?? [];
    const isExerciseDone = (i) => {
        const sets = setsOf(i);
        return sets.length > 0 && sets.every(s => s.done);
    };

    const updateSet = (exIndex, setIndex, patch) => {
        setSession(prev => {
            const next = { ...prev };
            const entry = next[exIndex] ?? { sets: [] };
            const sets = entry.sets.map((s, i) => (i === setIndex ? { ...s, ...patch } : s));
            next[exIndex] = { ...entry, sets };
            return next;
        });
    };

    const toggleSetDone = (exIndex, setIndex) => {
        setSession(prev => {
            const next = { ...prev };
            const entry = next[exIndex] ?? { sets: [] };
            const sets = entry.sets.map(s => ({ ...s }));
            const target = sets[setIndex];
            if (!target) return prev;

            target.done = !target.done;

            // Completing a set pre-fills the next one — a straight-across session
            // becomes one tap per set instead of retyping the same numbers.
            if (target.done) {
                const nextSet = sets[setIndex + 1];
                if (nextSet && !nextSet.done && nextSet.weight === '' && nextSet.reps === '') {
                    nextSet.weight = target.weight;
                    nextSet.reps = target.reps;
                }
            }

            next[exIndex] = { ...entry, sets };
            return next;
        });
    };

    const completedCount = exercises.reduce((n, _, i) => n + (isExerciseDone(i) ? 1 : 0), 0);
    const progress = exercises.length > 0
        ? Math.round((completedCount / exercises.length) * 100)
        : 0;
    const allDone = completedCount === exercises.length && exercises.length > 0;

    // Requested minutes, for flagging a session the exercise pool couldn't fill.
    const requestedMinutes = parseInt(header.duration, 10);
    const isShort =
        Number.isFinite(estimatedMinutes) &&
        Number.isFinite(requestedMinutes) &&
        requestedMinutes - estimatedMinutes >= 10;

    // Group consecutive superset partners so they render inside one bracket.
    const blocks = [];
    exercises.forEach((ex, i) => {
        const last = blocks[blocks.length - 1];
        if (ex.supersetId && last?.supersetId === ex.supersetId) {
            last.items.push({ ex, i });
        } else if (ex.supersetId) {
            blocks.push({ supersetId: ex.supersetId, items: [{ ex, i }] });
        } else {
            blocks.push({ supersetId: null, items: [{ ex, i }] });
        }
    });

    let lastType = null;

    const renderSetLogger = (ex, exIndex) => {
        const sets = setsOf(exIndex);
        const bodyweight = isBodyweight(ex);
        const timeBased = isTimeBased(ex);

        return (
            <div className="set-log">
                <div className="set-log-head">
                    <span>Set</span>
                    <span>{bodyweight ? `Added (${unit})` : `Weight (${unit})`}</span>
                    <span>{timeBased ? 'Secs' : 'Reps'}</span>
                    <span />
                </div>

                {sets.map((set, setIndex) => (
                    <div key={setIndex} className={`set-row ${set.done ? 'set-row-done' : ''}`}>
                        <span className="set-num">{setIndex + 1}</span>
                        <input
                            className="set-input"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.5"
                            placeholder={bodyweight ? 'BW' : '—'}
                            value={set.weight}
                            onChange={(e) => updateSet(exIndex, setIndex, { weight: e.target.value })}
                            aria-label={`Set ${setIndex + 1} weight`}
                        />
                        <input
                            className="set-input"
                            type="number"
                            inputMode="numeric"
                            min="0"
                            placeholder={ex.reps}
                            value={set.reps}
                            onChange={(e) => updateSet(exIndex, setIndex, { reps: e.target.value })}
                            aria-label={`Set ${setIndex + 1} ${timeBased ? 'seconds' : 'reps'}`}
                        />
                        <button
                            type="button"
                            className={`set-check ${set.done ? 'checked' : ''}`}
                            onClick={() => toggleSetDone(exIndex, setIndex)}
                            aria-label={`Mark set ${setIndex + 1} ${set.done ? 'incomplete' : 'complete'}`}
                        >
                            <Check size={14} strokeWidth={3} />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderLoggedSummary = (exIndex) => {
        // Mirrors commitWorkoutLogs — anything entered counts, ticked or not.
        const sets = setsOf(exIndex).filter(s => s.weight !== '' || s.reps !== '');
        if (sets.length === 0) return null;
        const text = formatEntry({
            unit,
            sets: sets.map(s => ({
                weight: s.weight === '' ? null : Number(s.weight),
                reps: s.reps === '' ? null : Number(s.reps),
            })),
        });
        return text ? <div className="logged-summary"><Check size={13} /> Logged {text}</div> : null;
    };

    const renderRow = (ex, i) => {
        const done = isExerciseDone(i);
        const open = expanded === i;
        const last = getLastEntry(ex.name, workoutId, logs);
        const lastText = last ? formatEntry(last) : null;

        return (
            <div key={i} className={`exercise-entry ${done ? 'exercise-done' : ''}`}>
                <div
                    className={`exercise-row animate-fade-in stagger-${Math.min(i + 1, 5)}`}
                    onClick={() => interactive && setExpanded(open ? null : i)}
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                >
                    {interactive && (
                        <div className={`exercise-checkbox ${done ? 'checked' : ''}`}>
                            {done && <Check size={14} strokeWidth={3} />}
                        </div>
                    )}
                    <div className="exercise-number">{i + 1}</div>
                    <div className="exercise-info">
                        <div className={`exercise-name ${done ? 'exercise-name-done' : ''}`}>{ex.name}</div>
                        <div className="exercise-detail">
                            {ex.equipment !== 'None' ? ex.equipment : 'No equipment'} ·{' '}
                            <span className={`type-badge ${ex.type.toLowerCase()}`}>{ex.type}</span>
                        </div>
                        {lastText && (
                            <div className="last-time">
                                <HistoryIcon size={12} /> Last: {lastText}
                            </div>
                        )}
                        {!interactive && renderLoggedSummary(i)}
                    </div>
                    <div className="exercise-stats">
                        <div className="exercise-sets">{ex.sets} × {ex.reps}</div>
                        {ex.tempo !== '—' && (
                            <div className="exercise-tempo">Tempo {ex.tempo}</div>
                        )}
                        {interactive && (
                            <ChevronDown
                                size={16}
                                className={`exercise-chevron ${open ? 'open' : ''}`}
                            />
                        )}
                    </div>
                </div>

                {interactive && open && renderSetLogger(ex, i)}
            </div>
        );
    };

    return (
        <div className="workout-card">
            {/* Header */}
            <div className="workout-card-header">
                <div className="header-meta">
                    <span className="meta-tag">{header.goal}</span>
                    <span className="meta-tag">{header.location}</span>
                    <span className="meta-tag">{header.duration}</span>
                    <span className="meta-tag">{header.level}</span>
                </div>
                <h2>{header.bodyParts.join(' + ')}</h2>
                <p className="header-subtitle">{header.goalFocus} Focus · {restPeriod}</p>
                {Number.isFinite(estimatedMinutes) && (
                    <div className="workout-estimate">
                        <Timer size={14} />
                        <span>~{estimatedMinutes} min actual</span>
                        {Number.isFinite(totalSets) && <span>· {totalSets} sets</span>}
                    </div>
                )}
            </div>

            {/* Honest note when the exercise library couldn't fill the requested time */}
            {isShort && (
                <div className="workout-note">
                    <AlertCircle size={15} />
                    <span>
                        Not enough exercises for {header.bodyParts.join(' + ')} to fill {header.duration}.
                        Add another muscle group for a longer session.
                    </span>
                </div>
            )}

            {/* Progress Bar */}
            {interactive && completedCount > 0 && (
                <div className="workout-progress">
                    <div className="workout-progress-bar">
                        <div
                            className="workout-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="workout-progress-text">
                        {allDone ? (
                            <><Trophy size={14} /> Workout Complete!</>
                        ) : (
                            <>{completedCount}/{exercises.length} done</>
                        )}
                    </span>
                </div>
            )}

            {interactive && (
                <p className="log-hint">Tap an exercise to log your weight and reps.</p>
            )}

            {/* Exercise List */}
            <div className="exercise-list">
                {blocks.map((block, bi) => {
                    const firstEx = block.items[0].ex;
                    const showDivider = !block.supersetId && firstEx.type !== lastType;
                    if (!block.supersetId) lastType = firstEx.type;

                    if (block.supersetId) {
                        return (
                            <div key={`ss-${bi}`} className="superset-group">
                                <div className="superset-label">
                                    Superset {block.supersetId} · {firstEx.sets} rounds, minimal rest between
                                </div>
                                {block.items.map(({ ex, i }) => renderRow(ex, i))}
                            </div>
                        );
                    }

                    return (
                        <div key={`st-${bi}`}>
                            {showDivider && (
                                <div className="section-divider">
                                    <span>{firstEx.type}</span>
                                </div>
                            )}
                            {block.items.map(({ ex, i }) => renderRow(ex, i))}
                        </div>
                    );
                })}
            </div>

            {/* Rest Period Badge */}
            <div style={{ padding: '0 var(--space-md)' }}>
                <div className="rest-badge">
                    <Clock size={14} /> {restPeriod}
                </div>
            </div>

            {/* Footer — Elite Insight */}
            <div className="workout-card-footer">
                <div className="workout-insight">
                    <Lightbulb size={18} className="workout-insight-icon" />
                    <div>
                        <p className="insight-label">Elite Insight</p>
                        <p>{insight}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
