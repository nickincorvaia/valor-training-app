import { useState } from 'react';
import WorkoutCard from './WorkoutCard';
import { ClipboardList, Trash2 } from 'lucide-react';

export default function History() {
    const [history, setHistory] = useState(() => {
        return JSON.parse(localStorage.getItem('vigor_history') || '[]');
    });
    const [expandedId, setExpandedId] = useState(null);

    const handleDelete = (id, e) => {
        e.stopPropagation();
        const updated = history.filter(w => w.id !== id);
        setHistory(updated);
        localStorage.setItem('vigor_history', JSON.stringify(updated));
        if (expandedId === id) setExpandedId(null);
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    if (history.length === 0) {
        return (
            <div className="page">
                <div className="page-header">
                    <h1 className="page-title">Workout <span className="text-gradient">History</span></h1>
                </div>
                <div className="empty-state">
                    <img src={`${import.meta.env.BASE_URL}fitness-icons.png`} alt="Get started" style={{ width: '200px', height: 'auto', opacity: 0.7, marginBottom: 'var(--space-lg)' }} />
                    <h3>No workouts yet</h3>
                    <p>Generated workouts will appear here. Go construct your first session!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <img src={`${import.meta.env.BASE_URL}hero-banner.png`} alt="Your journey" className="hero-banner animate-fade-in" />
            <div className="page-header">
                <h1 className="page-title">Workout <span className="text-gradient">History</span></h1>
                <p className="page-subtitle">{history.length} session{history.length !== 1 ? 's' : ''} logged</p>
            </div>

            {history.map((workout, i) => (
                <div key={workout.id} className={`animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
                    {expandedId === workout.id ? (
                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <WorkoutCard workout={workout} />
                            <button
                                className="btn btn-ghost btn-full mt-sm"
                                onClick={() => setExpandedId(null)}
                            >
                                Collapse
                            </button>
                        </div>
                    ) : (
                        <div
                            className="history-card"
                            onClick={() => setExpandedId(workout.id)}
                        >
                            <div className="history-card-header">
                                <div>
                                    <div className="title">{workout.header.bodyParts.join(' + ')}</div>
                                    <div className="date">{formatDate(workout.createdAt)}</div>
                                </div>
                                <button
                                    className="btn btn-ghost btn-icon"
                                    onClick={(e) => handleDelete(workout.id, e)}
                                    style={{ color: 'var(--text-muted)' }}
                                    title="Delete workout"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="tags">
                                <span className="tag">{workout.header.goal}</span>
                                <span className="tag">{workout.header.location}</span>
                                <span className="tag">{workout.header.duration}</span>
                                <span className="tag">{workout.header.level}</span>
                            </div>
                            <div className="exercise-count mt-sm">
                                {workout.exercises.length} exercises · Tap to expand
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
