import { useState, useMemo } from 'react';
import { X, Calculator, AlertCircle } from 'lucide-react';
import {
    BARS, BAR_LABELS, PLATE_COLORS, calculatePlates, formatPlates,
} from '../utils/plates';

export default function PlateCalculator({ onClose, unit: unitProp = 'lb' }) {
    const [unit, setUnit] = useState(unitProp);
    const [bar, setBar] = useState(BARS[unitProp][0]);
    const [target, setTarget] = useState('');

    const switchUnit = (next) => {
        setUnit(next);
        setBar(BARS[next][0]);
    };

    const result = useMemo(
        () => calculatePlates(parseFloat(target), bar, unit),
        [target, bar, unit]
    );

    const quickAdd = (amount) => {
        const current = parseFloat(target) || 0;
        setTarget(String(Math.round((current + amount) * 100) / 100));
    };

    return (
        <div className="timer-overlay" onClick={onClose}>
            <div
                className="timer-container animate-scale-in plate-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="timer-header">
                    <Calculator size={20} style={{ color: 'var(--accent-primary)' }} />
                    <h3>Plate Calculator</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Unit toggle */}
                <div className="chip-group" style={{ justifyContent: 'center' }}>
                    {['lb', 'kg'].map(u => (
                        <div
                            key={u}
                            className={`chip ${unit === u ? 'active' : ''}`}
                            onClick={() => switchUnit(u)}
                        >
                            {u.toUpperCase()}
                        </div>
                    ))}
                </div>

                {/* Target weight */}
                <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                    <label className="form-label" htmlFor="plate-target">Target Weight</label>
                    <input
                        id="plate-target"
                        className="form-input"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.5"
                        placeholder={`e.g. ${unit === 'lb' ? '135' : '60'}`}
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 700 }}
                    />
                    <div className="chip-group" style={{ justifyContent: 'center', marginTop: 'var(--space-sm)' }}>
                        {(unit === 'lb' ? [45, 25, 10, 5] : [20, 10, 5, 2.5]).map(inc => (
                            <div key={inc} className="chip" onClick={() => quickAdd(inc)}>+{inc}</div>
                        ))}
                        <div className="chip" onClick={() => setTarget('')}>Clear</div>
                    </div>
                </div>

                {/* Bar weight */}
                <div className="form-group">
                    <label className="form-label">Bar Weight</label>
                    <div className="chip-group" style={{ justifyContent: 'center' }}>
                        {BARS[unit].map(b => (
                            <div
                                key={b}
                                className={`chip ${bar === b ? 'active' : ''}`}
                                onClick={() => setBar(b)}
                            >
                                {b === 0 ? 'None' : `${b} ${unit}`}
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-xs)' }}>
                        {BAR_LABELS[bar] || 'Custom'} bar
                    </p>
                </div>

                {/* Result */}
                <div className="plate-result">
                    {result.status === 'empty' && (
                        <p className="plate-hint">Enter a target weight to see the loading.</p>
                    )}

                    {result.status === 'below-bar' && (
                        <p className="plate-hint plate-hint-warn">
                            <AlertCircle size={14} /> Target is lighter than the {bar} {unit} bar.
                        </p>
                    )}

                    {result.status === 'bar-only' && (
                        <p className="plate-hint">Just the bar — no plates needed.</p>
                    )}

                    {(result.status === 'exact' || result.status === 'approximate') && (
                        <>
                            <div className="plate-equation">
                                <span className="plate-total">{result.achieved} {unit}</span>
                                <span className="plate-equals">=</span>
                                <span className="plate-bar-part">{bar} bar</span>
                                <span className="plate-plus">+ 2 ×</span>
                                <span className="plate-breakdown">({formatPlates(result.plates)})</span>
                            </div>

                            <div className="plate-stack">
                                {result.plates.flatMap(({ size, count }) =>
                                    Array.from({ length: count }, (_, i) => (
                                        <span
                                            key={`${size}-${i}`}
                                            className="plate-chip"
                                            style={{
                                                background: PLATE_COLORS[unit][size] || 'var(--bg-elevated)',
                                                color: size === 5 ? '#0a0a0f' : '#fff',
                                            }}
                                        >
                                            {size}
                                        </span>
                                    ))
                                )}
                            </div>

                            <p className="plate-per-side">
                                {result.perSide} {unit} per side
                            </p>

                            {result.status === 'approximate' && (
                                <p className="plate-hint plate-hint-warn">
                                    <AlertCircle size={14} />
                                    Closest loadable is {result.achieved} {unit} — {result.remainder} {unit} short of {target}.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
