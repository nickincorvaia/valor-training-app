import { useState, useMemo } from 'react';
import exercises, { BODY_PARTS } from '../data/exercises';
import { Search, Dumbbell, Filter } from 'lucide-react';

export default function ExerciseBrowser() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPart, setSelectedPart] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');

    const filtered = useMemo(() => {
        return exercises.filter(ex => {
            const matchSearch = searchQuery === '' ||
                ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());

            const matchPart = selectedPart === 'All' ||
                ex.bodyPart === selectedPart ||
                ex.bodyPart.includes(selectedPart);

            const matchLocation = selectedLocation === 'All' ||
                (selectedLocation === 'Home' && ex.location === 'Home/Gym') ||
                (selectedLocation === 'Gym');

            return matchSearch && matchPart && matchLocation;
        });
    }, [searchQuery, selectedPart, selectedLocation]);

    // Group by body part
    const grouped = useMemo(() => {
        const groups = {};
        filtered.forEach(ex => {
            const key = ex.bodyPart;
            if (!groups[key]) groups[key] = [];
            groups[key].push(ex);
        });
        return groups;
    }, [filtered]);

    return (
        <div className="page">
            {/* Hero Banner */}
            <img src="hero-banner.png" alt="Train with intensity" className="hero-banner animate-fade-in" />

            <div className="page-header">
                <h1 className="page-title">Exercise <span className="text-gradient">Library</span></h1>
                <p className="page-subtitle">{exercises.length} exercises available</p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 'var(--space-md)' }}>
                <Search
                    size={18}
                    style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                    }}
                />
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search exercises or equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                />
            </div>

            {/* Filters */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
                <div className="chip-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <div
                        className={`chip ${selectedLocation === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedLocation('All')}
                    >
                        All Locations
                    </div>
                    <div
                        className={`chip ${selectedLocation === 'Home' ? 'active' : ''}`}
                        onClick={() => setSelectedLocation('Home')}
                    >
                        🏠 Home
                    </div>
                    <div
                        className={`chip ${selectedLocation === 'Gym' ? 'active' : ''}`}
                        onClick={() => setSelectedLocation('Gym')}
                    >
                        🏋️ Gym
                    </div>
                </div>
                <div className="chip-group" style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px' }}>
                    <div
                        className={`chip ${selectedPart === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedPart('All')}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        All
                    </div>
                    {BODY_PARTS.map(part => (
                        <div
                            key={part}
                            className={`chip ${selectedPart === part ? 'active' : ''}`}
                            onClick={() => setSelectedPart(part)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {part}
                        </div>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                Showing {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
            </div>

            {Object.entries(grouped).map(([bodyPart, exs]) => (
                <div key={bodyPart} className="mb-lg">
                    <div className="section-divider mb-sm">
                        <span>{bodyPart}</span>
                    </div>
                    {exs.map((ex, i) => (
                        <div
                            key={ex.name}
                            className={`exercise-row animate-fade-in stagger-${Math.min(i + 1, 5)}`}
                            style={{ borderRadius: 'var(--radius-md)' }}
                        >
                            <div className="exercise-number">
                                <Dumbbell size={14} />
                            </div>
                            <div className="exercise-info">
                                <div className="exercise-name">{ex.name}</div>
                                <div className="exercise-detail">
                                    {ex.equipment !== 'None' ? ex.equipment : 'No equipment'} ·{' '}
                                    {ex.location === 'Home/Gym' ? '🏠🏋️' : '🏋️'} ·{' '}
                                    <span className={`type-badge ${ex.compound ? 'compound' : 'isolation'}`}>
                                        {ex.compound ? 'Compound' : 'Isolation'}
                                    </span>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', maxWidth: '80px' }}>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Alt:</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ex.alternative}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {filtered.length === 0 && (
                <div className="empty-state">
                    <Filter />
                    <h3>No matches found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}
