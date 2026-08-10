// Barbell loading math. Kept separate from the component so it stays pure
// and testable — and so the component file only exports a component.

// Plates available per side, heaviest first — the greedy loader depends on this order.
export const PLATES = {
    lb: [45, 35, 25, 10, 5, 2.5],
    kg: [25, 20, 15, 10, 5, 2.5, 1.25],
};

export const BARS = {
    lb: [45, 35, 15, 0],
    kg: [20, 15, 10, 0],
};

export const BAR_LABELS = {
    45: 'Olympic', 35: "Women's", 20: 'Olympic', 15: "Women's",
    10: 'Training', 0: 'No bar',
};

// Colour coding roughly follows calibrated competition plates.
export const PLATE_COLORS = {
    lb: { 45: '#2563eb', 35: '#eab308', 25: '#16a34a', 10: '#dc2626', 5: '#f8fafc', 2.5: '#94a3b8' },
    kg: { 25: '#dc2626', 20: '#2563eb', 15: '#eab308', 10: '#16a34a', 5: '#f8fafc', 2.5: '#dc2626', 1.25: '#94a3b8' },
};

/**
 * Greedily loads the heaviest plates that fit on one side of the bar.
 * Returns the achievable weight, which may fall short of the target when no
 * combination of available plates lands exactly on it.
 */
export function calculatePlates(target, bar, unit) {
    const sizes = PLATES[unit];
    const perSide = (target - bar) / 2;

    if (!Number.isFinite(target) || target <= 0) {
        return { status: 'empty', perSide: 0, plates: [], achieved: bar, remainder: 0 };
    }
    if (target < bar) {
        return { status: 'below-bar', perSide: 0, plates: [], achieved: bar, remainder: 0 };
    }
    if (perSide === 0) {
        return { status: 'bar-only', perSide: 0, plates: [], achieved: bar, remainder: 0 };
    }

    let left = perSide;
    const plates = [];
    for (const size of sizes) {
        const count = Math.floor((left + 1e-9) / size);
        if (count > 0) {
            plates.push({ size, count });
            left -= count * size;
        }
    }

    const loadedPerSide = perSide - left;
    const achieved = bar + loadedPerSide * 2;
    const remainder = Math.round((target - achieved) * 100) / 100;

    return {
        status: remainder > 0.001 ? 'approximate' : 'exact',
        perSide: Math.round(loadedPerSide * 100) / 100,
        plates,
        achieved: Math.round(achieved * 100) / 100,
        remainder,
    };
}

/**
 * Formats a plate breakdown the way a lifter reads it: "45 + 2×25 + 10"
 */
export function formatPlates(plates) {
    if (plates.length === 0) return '—';
    return plates
        .map(({ size, count }) => (count > 1 ? `${count}×${size}` : `${size}`))
        .join(' + ');
}
