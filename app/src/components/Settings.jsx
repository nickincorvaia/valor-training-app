import { useState, useRef } from 'react';
import { BODY_PARTS, FITNESS_LEVELS } from '../data/exercises';
import {
    Save, RotateCcw, Home, Building2, TrendingUp, TrendingDown,
    Dumbbell, Volume2, VolumeX, Trash2, CheckCircle,
    Download, Upload, Copy, AlertCircle
} from 'lucide-react';
import {
    buildBackup, backupFilename, downloadBackup, copyBackupToClipboard,
    parseBackup, mergeHistory, readHistory, writeHistory, mergeLogs, clearLogs,
} from '../utils/backup';
import { pruneSessions } from '../utils/logs';
import { DEFAULT_PREFS, savePrefs, usePreferences } from '../utils/prefs';

export default function Settings() {
    const [prefs, updatePrefs] = usePreferences();
    const [saved, setSaved] = useState(false);
    const [notice, setNotice] = useState(null); // { kind: 'ok' | 'error', text }
    const fileInputRef = useRef(null);

    const flash = (kind, text) => {
        setNotice({ kind, text });
        setTimeout(() => setNotice(null), 5000);
    };

    const handleSave = () => {
        savePrefs(prefs);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        updatePrefs(DEFAULT_PREFS);
    };

    const handleClearHistory = () => {
        if (confirm('Clear all workout history? This cannot be undone.\n\nExport a backup first if you want to keep it.')) {
            localStorage.removeItem('vigor_history');
            clearLogs();
            pruneSessions([]);
            flash('ok', 'Workout history and weight logs cleared.');
        }
    };

    const handleExport = () => {
        const payload = buildBackup();
        if (payload.history.length === 0) {
            flash('error', 'No workouts to export yet.');
            return;
        }
        const ok = downloadBackup(payload, backupFilename());
        flash(
            ok ? 'ok' : 'error',
            ok
                ? `Exported ${payload.history.length} workout${payload.history.length === 1 ? '' : 's'}.`
                : "Download blocked — use \"Copy backup\" instead."
        );
    };

    const handleCopy = async () => {
        const payload = buildBackup();
        if (payload.history.length === 0) {
            flash('error', 'No workouts to copy yet.');
            return;
        }
        const ok = await copyBackupToClipboard(payload);
        flash(
            ok ? 'ok' : 'error',
            ok ? 'Backup JSON copied to clipboard.' : 'Could not access the clipboard.'
        );
    };

    const handleImportFile = async (event) => {
        const file = event.target.files?.[0];
        // Reset immediately so re-picking the same file still fires onChange.
        event.target.value = '';
        if (!file) return;

        let text;
        try {
            text = await file.text();
        } catch {
            flash('error', "Couldn't read that file.");
            return;
        }

        const parsed = parseBackup(text);
        if (!parsed.ok) {
            flash('error', parsed.error);
            return;
        }

        const { merged, added, duplicates } = mergeHistory(readHistory(), parsed.workouts);
        writeHistory(merged);
        const loggedSets = mergeLogs(parsed.logs);

        const parts = [`Imported ${added} workout${added === 1 ? '' : 's'}`];
        if (loggedSets > 0) parts.push(`${loggedSets} weight log${loggedSets === 1 ? '' : 's'}`);
        if (duplicates > 0) parts.push(`${duplicates} already present`);
        if (parsed.skipped > 0) parts.push(`${parsed.skipped} unreadable entry skipped`);
        flash('ok', `${parts.join(' · ')}.`);
    };

    const toggleFavBodyPart = (part) => {
        const current = prefs.favoriteBodyParts || [];
        if (current.includes(part)) {
            updatePrefs({ favoriteBodyParts: current.filter(p => p !== part) });
        } else {
            updatePrefs({ favoriteBodyParts: [...current, part] });
        }
    };

    return (
        <div className="page">
            {/* Fitness Icons Banner */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
                <img src={`${import.meta.env.BASE_URL}fitness-icons.png`} alt="Valor Training" style={{ width: '180px', height: 'auto', opacity: 0.8 }} className="animate-fade-in" />
            </div>

            <div className="page-header">
                <h1 className="page-title">
                    <span className="text-gradient">Settings</span>
                </h1>
                <p className="page-subtitle">Your default workout preferences</p>
            </div>

            {/* Saved Toast */}
            {saved && (
                <div className="toast animate-fade-in">
                    <CheckCircle size={16} /> Preferences saved!
                </div>
            )}

            {/* Default Location */}
            <div className="form-group">
                <label className="form-label">Default Location</label>
                <div className="option-cards-grid">
                    <div
                        className={`option-card ${prefs.location === 'home' ? 'active' : ''}`}
                        onClick={() => updatePrefs({ location: 'home' })}
                    >
                        <div className="option-icon orange"><Home size={20} /></div>
                        <div className="option-text">
                            <h4>Home</h4>
                            <p>Dumbbells, bodyweight & bench</p>
                        </div>
                    </div>
                    <div
                        className={`option-card ${prefs.location === 'gym' ? 'active' : ''}`}
                        onClick={() => updatePrefs({ location: 'gym' })}
                    >
                        <div className="option-icon blue"><Building2 size={20} /></div>
                        <div className="option-text">
                            <h4>Gym</h4>
                            <p>Full access — barbells, cables & machines</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Default Goal */}
            <div className="form-group">
                <label className="form-label">Default Goal</label>
                <div className="option-cards-grid">
                    <div
                        className={`option-card ${prefs.goal === 'bulking' ? 'active' : ''}`}
                        onClick={() => updatePrefs({ goal: 'bulking' })}
                    >
                        <div className="option-icon orange"><TrendingUp size={20} /></div>
                        <div className="option-text">
                            <h4>Bulking</h4>
                            <p>Hypertrophy · 8–12 reps · 90s rest</p>
                        </div>
                    </div>
                    <div
                        className={`option-card ${prefs.goal === 'cutting' ? 'active' : ''}`}
                        onClick={() => updatePrefs({ goal: 'cutting' })}
                    >
                        <div className="option-icon green"><TrendingDown size={20} /></div>
                        <div className="option-text">
                            <h4>Cutting</h4>
                            <p>Fat loss · 12–20 reps · 30–45s rest</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Default Level */}
            <div className="form-group">
                <label className="form-label">Default Fitness Level</label>
                <div className="option-cards-grid">
                    {Object.entries(FITNESS_LEVELS).map(([key, val]) => (
                        <div
                            key={key}
                            className={`option-card ${prefs.level === key ? 'active' : ''}`}
                            onClick={() => updatePrefs({ level: key })}
                        >
                            <div className={`option-icon ${key === 'beginner' ? 'green' : key === 'intermediate' ? 'blue' : 'orange'}`}>
                                <Dumbbell size={20} />
                            </div>
                            <div className="option-text">
                                <h4>{val.label}</h4>
                                <p>{val.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Default Duration */}
            <div className="form-group">
                <label className="form-label">Default Duration</label>
                <div className="slider-container">
                    <div className="slider-value" style={{ fontSize: '2rem' }}>
                        <span className="text-gradient">{prefs.duration}</span> <span>min</span>
                    </div>
                    <input
                        type="range"
                        min="15" max="90" step="5"
                        value={prefs.duration}
                        onChange={(e) => updatePrefs({ duration: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            {/* Favorite Body Parts */}
            <div className="form-group">
                <label className="form-label">Favorite Muscle Groups</label>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                    These will be pre-selected when building workouts
                </p>
                <div className="chip-group">
                    {BODY_PARTS.map(part => (
                        <div
                            key={part}
                            className={`chip ${(prefs.favoriteBodyParts || []).includes(part) ? 'active' : ''}`}
                            onClick={() => toggleFavBodyPart(part)}
                        >
                            {part}
                        </div>
                    ))}
                </div>
            </div>

            {/* Rest Timer Default */}
            <div className="form-group">
                <label className="form-label">Default Rest Timer</label>
                <div className="chip-group">
                    {[30, 45, 60, 90, 120, 180].map(sec => (
                        <div
                            key={sec}
                            className={`chip ${prefs.restTimerSeconds === sec ? 'active' : ''}`}
                            onClick={() => updatePrefs({ restTimerSeconds: sec })}
                        >
                            {sec >= 60 ? `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}` : `${sec}s`}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sound Toggle */}
            <div className="form-group">
                <label className="form-label">Timer Sound</label>
                <div
                    className={`option-card ${prefs.soundEnabled ? 'active' : ''}`}
                    onClick={() => updatePrefs({ soundEnabled: !prefs.soundEnabled })}
                >
                    <div className={`option-icon ${prefs.soundEnabled ? 'orange' : ''}`}>
                        {prefs.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </div>
                    <div className="option-text">
                        <h4>{prefs.soundEnabled ? 'Sound On' : 'Sound Off'}</h4>
                        <p>Beep countdown at 3, 2, 1</p>
                    </div>
                </div>
            </div>

            {/* Weight Unit — used by the plate calculator */}
            <div className="form-group">
                <label className="form-label">Weight Unit</label>
                <div className="chip-group">
                    {['lb', 'kg'].map(u => (
                        <div
                            key={u}
                            className={`chip ${(prefs.weightUnit || 'lb') === u ? 'active' : ''}`}
                            onClick={() => updatePrefs({ weightUnit: u })}
                        >
                            {u.toUpperCase()}
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
                    Sets the default for the plate calculator
                </p>
            </div>

            {/* Backup & Restore */}
            <div className="form-group">
                <label className="form-label">Backup &amp; Restore</label>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                    Your history and every weight you've logged live only on this device —
                    clearing app data erases them for good. Export a copy you can restore
                    later or move to a new phone.
                </p>

                {notice && (
                    <div
                        className={`backup-notice ${notice.kind === 'error' ? 'backup-notice-error' : ''}`}
                    >
                        {notice.kind === 'error' ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
                        <span>{notice.text}</span>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <button className="btn btn-secondary btn-full" onClick={handleExport}>
                        <Download size={16} /> Export History
                    </button>
                    <button className="btn btn-secondary btn-full" onClick={handleCopy}>
                        <Copy size={16} /> Copy Backup to Clipboard
                    </button>
                    <button
                        className="btn btn-secondary btn-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={16} /> Import History
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json,.json"
                        onChange={handleImportFile}
                        style={{ display: 'none' }}
                    />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
                    Importing merges with what's already here — nothing is overwritten.
                </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                <button className="btn btn-primary btn-full btn-lg" onClick={handleSave}>
                    <Save size={18} /> Save Preferences
                </button>
                <button className="btn btn-secondary btn-full" onClick={handleReset}>
                    <RotateCcw size={16} /> Reset to Defaults
                </button>
                <button
                    className="btn btn-ghost btn-full"
                    onClick={handleClearHistory}
                    style={{ color: 'var(--error)' }}
                >
                    <Trash2 size={16} /> Clear History &amp; Weight Logs
                </button>
            </div>
        </div>
    );
}
