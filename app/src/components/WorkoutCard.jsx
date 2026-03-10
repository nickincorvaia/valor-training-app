import { useState } from 'react';
import { Lightbulb, Clock, Check, Trophy } from 'lucide-react';

export default function WorkoutCard({ workout, interactive = true }) {
    if (!workout) return null;

    const { header, exercises, restPeriod, insight } = workout;
    const [completed, setCompleted] = useState(new Set());

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

    // Group exercises by type for section dividers
    let lastType = null;

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
            </div>

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
                {exercises.map((ex, i) => {
                    const showDivider = ex.type !== lastType;
                    lastType = ex.type;
                    const isDone = completed.has(i);

                    return (
                        <div key={i}>
                            {showDivider && (
                                <div className="section-divider">
                                    <span>{ex.type}</span>
                                </div>
                            )}
                            <div
                                className={`exercise-row animate-fade-in stagger-${Math.min(i + 1, 5)} ${isDone ? 'exercise-done' : ''}`}
                                onClick={() => toggleExercise(i)}
                                style={{ cursor: interactive ? 'pointer' : 'default' }}
                            >
                                {/* Checkbox */}
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
