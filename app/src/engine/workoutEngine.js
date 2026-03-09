// Vigor Concierge — The Movement Programmer (The Architect)
// Implements the workout generation logic from agents.md

import exercises, { GOALS, FITNESS_LEVELS, ELITE_INSIGHTS } from '../data/exercises';

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
 * Filter exercises by selected body parts
 */
function filterByBodyParts(exerciseList, bodyParts) {
    if (!bodyParts || bodyParts.length === 0) return exerciseList;

    return exerciseList.filter(ex => {
        // Handle compound body parts like "Back/Legs", "Biceps/Back", etc.
        const exParts = ex.bodyPart.split('/');
        return bodyParts.some(bp => exParts.includes(bp) || ex.bodyPart === bp);
    });
}

/**
 * Calculate total sets using the volume formula from agents.md:
 * Sets_Total = (Duration × Level_Coefficient) / Focus_Count
 * Where Level_Coefficient is 0.7 (Beginner), 1.0 (Intermediate), 1.3 (Advanced)
 */
function calculateTotalSets(duration, level, focusCount) {
    const coefficient = FITNESS_LEVELS[level].coefficient;
    return Math.round((duration * coefficient) / focusCount);
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

    // Step 1: Filter exercises
    let available = filterByLocation(exercises, location);
    available = filterByBodyParts(available, bodyParts);

    if (available.length === 0) {
        return null;
    }

    // Step 2: Calculate volume
    const focusCount = Math.max(bodyParts.length, 1);
    const totalSets = calculateTotalSets(duration, level, focusCount);

    // Step 3: Separate compound (multi-joint) and isolation (single-joint) exercises
    const compounds = shuffle(available.filter(ex => ex.compound));
    const isolations = shuffle(available.filter(ex => !ex.compound));

    // Step 4: Build the exercise list following the sequencing rule:
    // 1. Compound Heavy (Multi-joint)
    // 2. Isolation (Single-joint)
    // 3. Core/Cardio Finisher
    const selectedExercises = [];
    let remainingSets = totalSets;

    // Determine how many exercises we need (roughly 3-4 sets per exercise)
    const setsPerExercise = goal === 'bulking' ? 4 : 3;
    const targetExerciseCount = Math.max(3, Math.ceil(totalSets / setsPerExercise));

    // Allocate: ~60% compound, ~30% isolation, ~10% finisher
    const compoundCount = Math.ceil(targetExerciseCount * 0.6);
    const isolationCount = Math.ceil(targetExerciseCount * 0.3);

    // Add compounds
    for (let i = 0; i < Math.min(compoundCount, compounds.length); i++) {
        const sets = Math.min(setsPerExercise, remainingSets);
        if (sets <= 0) break;
        selectedExercises.push({
            ...compounds[i],
            sets,
            reps: goalConfig.repRange,
            tempo: generateTempo(goal),
            type: 'Compound',
        });
        remainingSets -= sets;
    }

    // Add isolations
    for (let i = 0; i < Math.min(isolationCount, isolations.length); i++) {
        const sets = Math.min(setsPerExercise - 1, remainingSets);
        if (sets <= 0) break;
        selectedExercises.push({
            ...isolations[i],
            sets: Math.max(2, sets),
            reps: goalConfig.repRange,
            tempo: generateTempo(goal),
            type: 'Isolation',
        });
        remainingSets -= Math.max(2, sets);
    }

    // Add a Core/Cardio finisher if applicable
    const finishers = shuffle(exercises.filter(ex =>
        (ex.bodyPart === 'Abs/Core' || ex.bodyPart === 'Cardio') &&
        (location === 'gym' || ex.location === 'Home/Gym')
    ));

    if (finishers.length > 0 && remainingSets > 0) {
        selectedExercises.push({
            ...finishers[0],
            sets: Math.min(3, remainingSets),
            reps: finishers[0].bodyPart === 'Cardio' ? '30–45s' : goalConfig.repRange,
            tempo: '—',
            type: 'Finisher',
        });
    }

    // Step 5: Select a random elite insight
    const insight = ELITE_INSIGHTS[Math.floor(Math.random() * ELITE_INSIGHTS.length)];

    // Step 6: Construct the workout card
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
        exercises: selectedExercises,
        restPeriod: `${goalConfig.restSeconds}s rest between sets`,
        insight,
        createdAt: new Date().toISOString(),
    };
}
