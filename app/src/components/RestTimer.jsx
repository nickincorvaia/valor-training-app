import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';

const PRESET_TIMES = [30, 45, 60, 90, 120, 180];

export default function RestTimer({ defaultSeconds = 90, onClose }) {
    const [totalSeconds, setTotalSeconds] = useState(defaultSeconds);
    const [remaining, setRemaining] = useState(defaultSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('valor_sound') !== 'false';
    });
    const intervalRef = useRef(null);
    const audioCtxRef = useRef(null);

    // Play a beep sound using Web Audio API
    const playBeep = useCallback(() => {
        if (!soundEnabled) return;
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            // Audio not available
        }
    }, [soundEnabled]);

    useEffect(() => {
        if (isRunning && remaining > 0) {
            intervalRef.current = setInterval(() => {
                setRemaining(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        clearInterval(intervalRef.current);
                        playBeep();
                        // Vibrate if available
                        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
                        return 0;
                    }
                    // Beep at 3, 2, 1
                    if (prev <= 4) playBeep();
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, remaining, playBeep]);

    const toggleTimer = () => {
        if (remaining === 0) {
            setRemaining(totalSeconds);
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setRemaining(totalSeconds);
    };

    const selectPreset = (sec) => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setTotalSeconds(sec);
        setRemaining(sec);
    };

    const toggleSound = () => {
        const newVal = !soundEnabled;
        setSoundEnabled(newVal);
        localStorage.setItem('valor_sound', String(newVal));
    };

    const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const isFinished = remaining === 0 && !isRunning;

    // Calculate circle circumference for SVG ring
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="timer-overlay">
            {/* Background image */}
            <img src="timer-bg.png" alt="" className="timer-bg-image" />
            <div className="timer-container animate-scale-in">
                {/* Header */}
                <div className="timer-header">
                    <button className="btn btn-ghost btn-icon" onClick={toggleSound}>
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <h3>Rest Timer</h3>
                    {onClose && (
                        <button className="btn btn-ghost btn-icon" onClick={onClose}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Timer Circle */}
                <div className="timer-circle-wrap">
                    <svg className="timer-svg" viewBox="0 0 280 280">
                        {/* Background circle */}
                        <circle
                            cx="140" cy="140" r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="140" cy="140" r={radius}
                            fill="none"
                            stroke={isFinished ? 'var(--success)' : 'url(#timerGradient)'}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 140 140)"
                            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                        />
                        <defs>
                            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ff4500" />
                                <stop offset="100%" stopColor="#ffab40" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="timer-display">
                        <div className={`timer-time ${isFinished ? 'timer-finished' : ''} ${remaining <= 3 && isRunning ? 'timer-pulse' : ''}`}>
                            {minutes}:{seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="timer-label">
                            {isFinished ? "Time's up!" : isRunning ? 'Resting...' : 'Ready'}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="timer-controls">
                    <button className="btn btn-secondary btn-icon" onClick={resetTimer}>
                        <RotateCcw size={20} />
                    </button>
                    <button
                        className={`btn ${isFinished ? 'btn-success' : 'btn-primary'} timer-play-btn`}
                        onClick={toggleTimer}
                    >
                        {isRunning ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <div style={{ width: '44px' }} /> {/* Spacer for centered layout */}
                </div>

                {/* Presets */}
                <div className="timer-presets">
                    {PRESET_TIMES.map(sec => (
                        <button
                            key={sec}
                            className={`chip ${totalSeconds === sec ? 'active' : ''}`}
                            onClick={() => selectPreset(sec)}
                        >
                            {sec >= 60 ? `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}` : `${sec}s`}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
