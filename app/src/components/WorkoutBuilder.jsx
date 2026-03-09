import { useState, useEffect } from 'react';
import { BODY_PARTS, GOALS, FITNESS_LEVELS } from '../data/exercises';
import { generateWorkout } from '../engine/workoutEngine';
import WorkoutCard from './WorkoutCard';
import RestTimer from './RestTimer';
import {
    Dumbbell, Home, Building2, TrendingUp, TrendingDown,
    ChevronRight, Zap, Sparkles, Timer
} from 'lucide-react';

const STEPS = ['location', 'goal', 'bodyParts', 'level', 'duration'];

function loadPrefs() {
    try {
        const stored = localStorage.getItem('valor_prefs');
        if (stored) return JSON.parse(stored);
    } catch (e) { /* */ }
    return null;
}

export default function WorkoutBuilder() {
    const prefs = loadPrefs();

    const [step, setStep] = useState(0);
    const [config, setConfig] = useState({
        location: prefs?.location || null,
        goal: prefs?.goal || null,
        bodyParts: prefs?.favoriteBodyParts?.length ? [...prefs.favoriteBodyParts] : [],
        level: prefs?.level || null,
        duration: prefs?.duration || 45,
    });
    const [workout, setWorkout] = useState(null);
    const [showTimer, setShowTimer] = useState(false);

    const currentStep = STEPS[step];

    const restTimerSeconds = (() => {
        if (workout) {
            // Get rest from goal config
            const goalConfig = GOALS[config.goal];
            return goalConfig?.restSeconds || prefs?.restTimerSeconds || 90;
        }
        return prefs?.restTimerSeconds || 90;
    })();

    const canProceed = () => {
        switch (currentStep) {
            case 'location': return config.location !== null;
            case 'goal': return config.goal !== null;
            case 'bodyParts': return config.bodyParts.length > 0;
            case 'level': return config.level !== null;
            case 'duration': return config.duration >= 15;
            default: return false;
        }
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            const result = generateWorkout(config);
            if (result) {
                setWorkout(result);
                const history = JSON.parse(localStorage.getItem('vigor_history') || '[]');
                history.unshift(result);
                if (history.length > 50) history.pop();
                localStorage.setItem('vigor_history', JSON.stringify(history));
            }
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleReset = () => {
        setWorkout(null);
        setShowTimer(false);
        setStep(0);
        const freshPrefs = loadPrefs();
        setConfig({
            location: freshPrefs?.location || null,
            goal: freshPrefs?.goal || null,
            bodyParts: freshPrefs?.favoriteBodyParts?.length ? [...freshPrefs.favoriteBodyParts] : [],
            level: freshPrefs?.level || null,
            duration: freshPrefs?.duration || 45,
        });
    };

    const toggleBodyPart = (part) => {
        setConfig(prev => ({
            ...prev,
            bodyParts: prev.bodyParts.includes(part)
                ? prev.bodyParts.filter(p => p !== part)
                : [...prev.bodyParts, part]
        }));
    };

    // If workout is generated, show the card + timer
    if (workout) {
        return (
            <div className="page">
                <div className="animate-scale-in">
                    <WorkoutCard workout={workout} />
                </div>

                {/* Timer Button */}
                <button
                    className="btn btn-primary btn-full btn-lg mt-md"
                    onClick={() => setShowTimer(true)}
                    style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                >
                    <Timer size={20} /> Start Rest Timer
                </button>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                    <button className="btn btn-secondary btn-full" onClick={handleReset}>
                        New Workout
                    </button>
                    <button className="btn btn-primary btn-full" onClick={() => {
                        const result = generateWorkout(config);
                        if (result) {
                            setWorkout(result);
                            const history = JSON.parse(localStorage.getItem('vigor_history') || '[]');
                            history.unshift(result);
                            if (history.length > 50) history.pop();
                            localStorage.setItem('vigor_history', JSON.stringify(history));
                        }
                    }}>
                        <Zap size={18} /> Regenerate
                    </button>
                </div>

                {/* Rest Timer Overlay */}
                {showTimer && (
                    <RestTimer
                        defaultSeconds={restTimerSeconds}
                        onClose={() => setShowTimer(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="page">
            {/* Logo & Brand Header (on first step) */}
            {step === 0 && (
                <div className="brand-header animate-fade-in">
                    <img src="/logo.png" alt="Valor Training" className="brand-logo" />
                </div>
            )}

            {/* Step Indicator */}
            <div className="step-indicator">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                    />
                ))}
            </div>

            {/* Step Content */}
            <div key={step} className="animate-fade-in">
                {currentStep === 'location' && (
                    <>
                        <div className="page-header">
                            <h1 className="page-title">Where are you <span className="text-gradient">training?</span></h1>
                            <p className="page-subtitle">This filters available exercises and equipment</p>
                        </div>
                        <div className="option-cards-grid">
                            <div
                                className={`option-card ${config.location === 'home' ? 'active' : ''}`}
                                onClick={() => setConfig({ ...config, location: 'home' })}
                            >
                                <div className="option-icon orange"><Home size={22} /></div>
                                <div className="option-text">
                                    <h4>Home</h4>
                                    <p>Dumbbells, bodyweight & bench</p>
                                </div>
                            </div>
                            <div
                                className={`option-card ${config.location === 'gym' ? 'active' : ''}`}
                                onClick={() => setConfig({ ...config, location: 'gym' })}
                            >
                                <div className="option-icon blue"><Building2 size={22} /></div>
                                <div className="option-text">
                                    <h4>Gym</h4>
                                    <p>Full access — barbells, cables & machines</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 'goal' && (
                    <>
                        <div className="page-header">
                            <h1 className="page-title">What's your <span className="text-gradient">goal?</span></h1>
                            <p className="page-subtitle">This adjusts rep ranges, tempo, and rest periods</p>
                        </div>
                        <div className="option-cards-grid">
                            <div
                                className={`option-card ${config.goal === 'bulking' ? 'active' : ''}`}
                                onClick={() => setConfig({ ...config, goal: 'bulking' })}
                            >
                                <div className="option-icon orange"><TrendingUp size={22} /></div>
                                <div className="option-text">
                                    <h4>Bulking</h4>
                                    <p>Hypertrophy · 8–12 reps · 90s rest</p>
                                </div>
                            </div>
                            <div
                                className={`option-card ${config.goal === 'cutting' ? 'active' : ''}`}
                                onClick={() => setConfig({ ...config, goal: 'cutting' })}
                            >
                                <div className="option-icon green"><TrendingDown size={22} /></div>
                                <div className="option-text">
                                    <h4>Cutting</h4>
                                    <p>Fat loss · 12–20 reps · 30–45s rest</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 'bodyParts' && (
                    <>
                        <div className="page-header">
                            <h1 className="page-title">Target <span className="text-gradient">muscle groups</span></h1>
                            <p className="page-subtitle">Select one or more areas to focus on</p>
                        </div>
                        <div className="chip-group">
                            {BODY_PARTS.map(part => (
                                <div
                                    key={part}
                                    className={`chip chip-lg ${config.bodyParts.includes(part) ? 'active' : ''}`}
                                    onClick={() => toggleBodyPart(part)}
                                >
                                    {part}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentStep === 'level' && (
                    <>
                        <div className="page-header">
                            <h1 className="page-title">Fitness <span className="text-gradient">level</span></h1>
                            <p className="page-subtitle">Adjusts exercise complexity and total volume</p>
                        </div>
                        <div className="option-cards-grid">
                            {Object.entries(FITNESS_LEVELS).map(([key, val]) => (
                                <div
                                    key={key}
                                    className={`option-card ${config.level === key ? 'active' : ''}`}
                                    onClick={() => setConfig({ ...config, level: key })}
                                >
                                    <div className={`option-icon ${key === 'beginner' ? 'green' : key === 'intermediate' ? 'blue' : 'orange'}`}>
                                        <Dumbbell size={22} />
                                    </div>
                                    <div className="option-text">
                                        <h4>{val.label}</h4>
                                        <p>Volume coefficient: {val.coefficient}×</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentStep === 'duration' && (
                    <>
                        <div className="page-header">
                            <h1 className="page-title">Workout <span className="text-gradient">duration</span></h1>
                            <p className="page-subtitle">How much time do you have?</p>
                        </div>
                        <div className="slider-container">
                            <div className="slider-value">
                                <span className="text-gradient">{config.duration}</span> <span>minutes</span>
                            </div>
                            <input
                                type="range"
                                min="15"
                                max="90"
                                step="5"
                                value={config.duration}
                                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
                            />
                            <div className="flex-between mt-sm" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>15 min</span>
                                <span>90 min</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
                {step > 0 && (
                    <button className="btn btn-secondary" onClick={handleBack}>
                        Back
                    </button>
                )}
                <button
                    className="btn btn-primary btn-full btn-lg"
                    disabled={!canProceed()}
                    onClick={handleNext}
                    style={{ opacity: canProceed() ? 1 : 0.4 }}
                >
                    {step === STEPS.length - 1 ? (
                        <><Sparkles size={20} /> Construct Workout</>
                    ) : (
                        <>Continue <ChevronRight size={18} /></>
                    )}
                </button>
            </div>
        </div>
    );
}
