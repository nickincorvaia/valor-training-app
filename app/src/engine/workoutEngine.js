// Vigor Concierge — The Movement Programmer (The Architect)
// Implements the workout generation logic from agents.md
//
// Volume is derived from a real time budget rather than an abstract coefficient:
// every set costs (work + rest) seconds, every new movement costs a transition,
// and exercises are added only while the requested duration still has room.

import exercises, {
    GOALS,
    FITNESS_LEVELS,
    ELITE_INSIGHTS,
    TRANSITION_SECONDS,
    MAX_SETS_PER_EXERCISE,
    DIFFICULTY_RANK,
    MIN_POOL_SIZE,
} from '../data/exercises';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Interleaves pools so multi-muscle workouts stay balanced instead of
 * exhausting the first body part before reaching the second.
 */
function roundRobin(pools) {
    const out = [];
    const longest = pools.reduce((max, p) => Math.max(max, p.length), 0);
    for (let i = 0; i < longest; i++) {
        for (const pool of pools) {
            if (i < pool.length) out.push(pool[i]);
        }
    }
    return out;
}

/**
 * Filter exercises based on location (home vs gym)
 * Home: Only DB, BW, and Adjustable Bench
 * Gym: Full access
 */
function filterByLocation(exerciseList, location) {
    if (location === 'gym') return exerciseList;

    // Home: restrict to bodyweight, dumbbells, and basic equipment
    const homeCategories = ['Bodyweight'];
    const homeEquipment = ['None', 'Dumbbells', 'Dumbbell', 'Bench/Chair', 'DB/Plate', 'DB + Bench',
        'DB/Barbell', 'DB/Bodyweight', 'Pull-up Bar', 'Wall', 'Plate/DB', 'Bench', 'Ab Wheel', 'Rope',
        'Box/Bench'];

    return exerciseList.filter(ex =>
        ex.location === 'Home/Gym' ||
        homeCategories.includes(ex.category) ||
        homeEquipment.includes(ex.equipment)
    );
}

/**
 * Returns true when an exercise targets one of the selected body parts.
 */
function matchesBodyPart(ex, bodyPart) {
    if (ex.bodyPart === bodyPart) return true;
    return ex.bodyPart.split('/').includes(bodyPart);
}

/**
 * Filter exercises by selected body parts
 */
function filterByBodyParts(exerciseList, bodyParts) {
    if (!bodyParts || bodyParts.length === 0) return exerciseList;
    return exerciseList.filter(ex => bodyParts.some(bp => matchesBodyPart(ex, bp)));
}

/**
 * Keeps movements at or below the lifter's level — a beginner shouldn't be
 * handed a conventional deadlift or a pistol squat. The gate is relaxed when
 * it would leave too small a pool to build a varied session from.
 */
function filterByDifficulty(exerciseList, level) {
    const cap = DIFFICULTY_RANK[FITNESS_LEVELS[level].maxDifficulty];
    const allowed = exerciseList.filter(
        ex => DIFFICULTY_RANK[ex.difficulty ?? 'intermediate'] <= cap
    );
    return allowed.length >= MIN_POOL_SIZE ? allowed : exerciseList;
}

/**
 * Generate tempo notation based on goal
 */
function generateTempo(goal) {
    if (goal === 'bulking') {
        const tempos = ['3-0-1', '3-1-1', '4-0-1', '2-1-1'];
        return tempos[Math.floor(Math.random() * tempos.length)];
    }
    // Cutting — faster tempo
    const tempos = ['2-0-1', '1-0-1', '2-0-0', '1-1-1'];
    return tempos[Math.floor(Math.random() * tempos.length)];
}

/**
 * Seconds consumed by a straight-set exercise.
 */
function straightSetCost(sets, goalConfig, restSeconds) {
    return TRANSITION_SECONDS + sets * (goalConfig.workSeconds + restSeconds);
}

/**
 * Seconds consumed by a superset pair. Both movements run back to back with a
 * short transition, then a single full rest — which is why more work fits into
 * the same clock than straight sets allow.
 */
function supersetCost(sets, goalConfig, restSeconds) {
    const perRound =
        goalConfig.workSeconds * 2 +
        goalConfig.supersetTransitionSeconds +
        restSeconds;
    return TRANSITION_SECONDS + sets * perRound;
}

/**
 * Builds the ordered candidate list following the sequencing rule from agents.md:
 * 1. Compound Heavy (Multi-joint) → 2. Isolation (Single-joint) → 3. Finisher
 */
function buildCandidates(available, bodyParts) {
    const groups = bodyParts.length > 0 ? bodyParts : ['__all__'];

    const poolsFor = (predicate) =>
        groups.map(bp =>
            shuffle(
                available.filter(
                    ex => predicate(ex) && (bp === '__all__' || matchesBodyPart(ex, bp))
                )
            )
        );

    const compounds = roundRobin(poolsFor(ex => ex.compound));
    const isolations = roundRobin(poolsFor(ex => !ex.compound));

    // Deduplicate — an exercise can match more than one selected body part.
    const seen = new Set();
    const dedupe = (list) =>
        list.filter(ex => {
            if (seen.has(ex.name)) return false;
            seen.add(ex.name);
            return true;
        });

    return {
        compounds: dedupe(compounds).map(ex => ({ ...ex, type: 'Compound' })),
        isolations: dedupe(isolations).map(ex => ({ ...ex, type: 'Isolation' })),
        seen,
    };
}

/**
 * Pairs a cutting workout's movements into supersets, preferring partners that
 * hit different body parts so one muscle rests while the other works.
 */
function pairForSupersets(list) {
    const remaining = [...list];
    const pairs = [];

    while (remaining.length > 1) {
        const first = remaining.shift();
        let partnerIndex = remaining.findIndex(ex => ex.bodyPart !== first.bodyPart);
        if (partnerIndex === -1) partnerIndex = 0;
        pairs.push([first, remaining.splice(partnerIndex, 1)[0]]);
    }

    return { pairs, leftover: remaining };
}

/**
 * Main workout generator
 * @param {Object} params
 * @param {string} params.level - beginner | intermediate | advanced
 * @param {string[]} params.bodyParts - Array of target body part names
 * @param {string} params.goal - bulking | cutting
 * @param {string} params.location - home | gym
 * @param {number} params.duration - Duration in minutes
 * @returns {Object} Generated workout card
 */
export function generateWorkout({ level, bodyParts, goal, location, duration }) {
    const goalConfig = GOALS[goal];
    const levelConfig = FITNESS_LEVELS[level];
    if (!goalConfig || !levelConfig) return null;

    // Step 1: Filter exercises
    let available = filterByLocation(exercises, location);
    available = filterByBodyParts(available, bodyParts);
    if (available.length === 0) return null;
    available = filterByDifficulty(available, level);

    // Step 2: Establish the time budget and per-set costs
    const restSeconds = Math.round(goalConfig.restSeconds * levelConfig.restMultiplier);
    let budget = duration * 60;

    // A short session spent entirely on one movement isn't a workout — trim the
    // sets per exercise so the available time still covers several movements.
    let setsPerExercise = levelConfig.setsPerExercise;
    if (duration <= 20) setsPerExercise = Math.max(2, setsPerExercise - 2);
    else if (duration <= 30) setsPerExercise = Math.max(2, setsPerExercise - 1);

    // Back-filling leftover time must not undo that trim.
    const setsCeiling = Math.min(MAX_SETS_PER_EXERCISE, setsPerExercise + 1);

    // Step 3: Ordered candidates, compounds before isolations
    const { compounds, isolations, seen } = buildCandidates(available, bodyParts);

    // Step 4: Reserve room for a finisher so it isn't always squeezed out
    const finishers = shuffle(
        filterByDifficulty(
            exercises.filter(ex =>
                (ex.bodyPart === 'Abs/Core' || ex.bodyPart === 'Cardio') &&
                !seen.has(ex.name) &&
                (location === 'gym' || ex.location === 'Home/Gym')
            ),
            level
        )
    );
    const finisherSets = Math.min(3, setsPerExercise);
    const rawFinisherReserve = finishers.length > 0
        ? straightSetCost(finisherSets, goalConfig, restSeconds)
        : 0;

    // The reserve must never starve the main work — a short session should still
    // return real exercises, dropping the finisher instead of returning nothing.
    const reserveFor = (chosenCount) => (chosenCount === 0 ? 0 : rawFinisherReserve);

    // Step 5: Spend the budget on main work
    const selected = [];
    const ordered = [...compounds, ...isolations];
    const useSupersets = goalConfig.supersets;

    if (useSupersets) {
        const { pairs, leftover } = pairForSupersets(ordered);
        let groupIndex = 0;

        for (const [a, b] of pairs) {
            const sets = Math.max(2, setsPerExercise - 1); // supersets run slightly fewer rounds
            const cost = supersetCost(sets, goalConfig, restSeconds);
            if (budget - cost < reserveFor(selected.length)) break;
            budget -= cost;

            const supersetId = String.fromCharCode(65 + groupIndex); // A, B, C…
            groupIndex++;
            [a, b].forEach((ex, i) => {
                selected.push({
                    ...ex,
                    sets,
                    reps: goalConfig.repRange,
                    tempo: generateTempo(goal),
                    supersetId,
                    supersetPosition: i + 1,
                });
            });
        }

        // A straight set can still fit where a full pair no longer does
        for (const ex of leftover) {
            const cost = straightSetCost(setsPerExercise, goalConfig, restSeconds);
            if (budget - cost < reserveFor(selected.length)) break;
            budget -= cost;
            selected.push({
                ...ex,
                sets: setsPerExercise,
                reps: goalConfig.repRange,
                tempo: generateTempo(goal),
                supersetId: null,
                supersetPosition: null,
            });
        }
    } else {
        for (const ex of ordered) {
            const sets = ex.type === 'Isolation'
                ? Math.max(2, setsPerExercise - 1)
                : setsPerExercise;
            const cost = straightSetCost(sets, goalConfig, restSeconds);
            if (budget - cost < reserveFor(selected.length)) break;
            budget -= cost;
            selected.push({
                ...ex,
                sets,
                reps: goalConfig.repRange,
                tempo: generateTempo(goal),
                supersetId: null,
                supersetPosition: null,
            });
        }
    }

    if (selected.length === 0) return null;

    // Step 6: Add the Core/Cardio finisher
    if (finishers.length > 0 && rawFinisherReserve > 0 && budget >= rawFinisherReserve) {
        budget -= rawFinisherReserve;
        selected.push({
            ...finishers[0],
            sets: finisherSets,
            reps: finishers[0].bodyPart === 'Cardio' ? '30–45s' : goalConfig.repRange,
            tempo: '—',
            type: 'Finisher',
            supersetId: null,
            supersetPosition: null,
        });
    }

    // Step 7: The exercise pool can run dry before the clock does — rather than
    // hand back a short session, add sets to the compound work already selected.
    let progressed = true;
    while (budget > 0 && progressed) {
        progressed = false;
        for (const ex of selected) {
            if (ex.type !== 'Compound' || ex.sets >= setsCeiling) continue;
            const extra = ex.supersetId
                ? goalConfig.workSeconds * 2 + goalConfig.supersetTransitionSeconds + restSeconds
                : goalConfig.workSeconds + restSeconds;
            // Both halves of a superset must move together, so charge once per pair.
            if (ex.supersetPosition === 2) continue;
            if (extra > budget) continue;

            budget -= extra;
            ex.sets += 1;
            if (ex.supersetId) {
                const partner = selected.find(
                    o => o.supersetId === ex.supersetId && o.supersetPosition === 2
                );
                if (partner) partner.sets = ex.sets;
            }
            progressed = true;
        }
    }

    // Step 8: Report the honest clock cost of what was actually built
    const countedPairs = new Set();
    const totalSeconds = selected.reduce((sum, ex) => {
        if (ex.supersetId) {
            if (countedPairs.has(ex.supersetId)) return sum;
            countedPairs.add(ex.supersetId);
            return sum + supersetCost(ex.sets, goalConfig, restSeconds);
        }
        return sum + straightSetCost(ex.sets, goalConfig, restSeconds);
    }, 0);

    const totalSets = selected.reduce((sum, ex) => sum + ex.sets, 0);
    const insight = ELITE_INSIGHTS[Math.floor(Math.random() * ELITE_INSIGHTS.length)];

    return {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        header: {
            goal: goalConfig.label,
            goalFocus: goalConfig.focus,
            location: location === 'gym' ? 'Gym' : 'Home',
            duration: `${duration} min`,
            level: levelConfig.label,
            bodyParts: bodyParts,
        },
        exercises: selected,
        totalSets,
        estimatedMinutes: Math.round(totalSeconds / 60),
        restSeconds,
        restPeriod: `${restSeconds}s rest between ${goalConfig.supersets ? 'rounds' : 'sets'}`,
        insight,
        createdAt: new Date().toISOString(),
    };
}
