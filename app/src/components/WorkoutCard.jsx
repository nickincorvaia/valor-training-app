import { useState, useEffect } from 'react';
import { Lightbulb, Clock, Check, Trophy, Timer, AlertCircle } from 'lucide-react';

const progressKey = (id) => `valor_progress_${id}`;

function loadProgress(id) {
    if (!id) return new Set();
    try {
        const stored = JSON.parse(localStorage.getItem(progressKey(id)) || '[]');
        return new Set(Array.isArray(stored) ? stored : []);
    } catch {
        return new Set();
    }
}

export default function WorkoutCard({ workout, interactive = true }) {
    // Hooks must run on every render — the early return lives below them, or React
    // throws "Rendered more hooks than during the previous render" the moment a
    // null workout becomes a real one.
    const workoutId = workout?.id ?? null;
    const [completed, setCompleted] = useState(() => loadProgress(workoutId));

    // Reload progress when a different workout is shown in the same card slot.
    useEffect(() => {
        setCompleted(loadProgress(workoutId));
    }, [workoutId]);

    // Persist so navigating to the timer and back doesn't wipe mid-workout progress.
    useEffect(() => {
        if (!workoutId || !interactive) return;
        localStorage.setItem(progressKey(workoutId), JSON.stringify([...completed]));
    }, [completed, workoutId, interactive]);

    if (!workout) return null;

    const { header, exercises, restPeriod, insight, estimatedMinutes, totalSets } = workout;

    const toggleExercise = (index) => {
        if (!interactive) return;
        setCompleted(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const progress = exercises.length > 0
        ? Math.round((completed.size / exercises.length) * 100)
        : 0;
    const allDone = completed.size === exercises.length && exercises.length > 0;

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

    const renderRow = (ex, i) => {
        const isDone = completed.has(i);
        return (
            <div
                key={i}
                className={`exercise-row animate-fade-in stagger-${Math.min(i + 1, 5)} ${isDone ? 'exercise-done' : ''}`}
                onClick={() => toggleExercise(i)}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
                {interactive && (
                    <div className={`exercise-checkbox ${isDone ? 'checked' : ''}`}>
                        {isDone && <Check size={14} strokeWidth={3} />}
                    </div>
                )}
                <div className="exercise-number">{i + 1}</div>
                <div className="exercise-info">
                    <div className={`exercise-name ${isDone ? 'exercise-name-done' : ''}`}>{ex.name}</div>
                    <div className="exercise-detail">
                        {ex.equipment !== 'None' ? ex.equipment : 'No equipment'} ·{' '}
                        <span className={`type-badge ${ex.type.toLowerCase()}`}>{ex.type}</span>
                    </div>
                    {ex.description && (
                        <div className="exercise-description" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                            {ex.description}
                        </div>
                    )}
                </div>
                <div className="exercise-stats">
                    <div className="exercise-sets">{ex.sets} × {ex.reps}</div>
                    {ex.tempo !== '—' && (
                        <div className="exercise-tempo">Tempo {ex.tempo}</div>
                    )}
                </div>
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

            {/* Progress Bar (only in interactive mode with at least one checked) */}
            {interactive && completed.size > 0 && (
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
                            <>{completed.size}/{exercises.length} done</>
                        )}
                    </span>
                </div>
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
