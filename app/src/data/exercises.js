// Exercise database for Valor Training
// Source: Expanded Workout Options and Logic.xlsx

const exercises = [
  // === CHEST ===
  { name: "Incline DB Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Incline Push-Ups", compound: true },
  { name: "Flat Barbell Bench", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Chest Press", compound: true },
  { name: "Decline Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Floor Press", compound: true },
  { name: "Cable Crossover", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Flyes", compound: false },
  { name: "Chest Dips", bodyPart: "Chest", location: "Gym", category: "Bodyweight", equipment: "Dip Bars", alternative: "Push-Ups", compound: true },
  { name: "Pec Deck Machine", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "DB Flyes", compound: false },
  { name: "Svend Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Floor Press", compound: false },

  // === BACK ===
  { name: "One-Arm DB Row", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Gorilla Rows", compound: true },
  { name: "Wide Grip Pull-Ups", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Lat Pulldown", compound: true },
  { name: "Seated Cable Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Rows", compound: true },
  { name: "Deadlift (Conventional)", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB RDL", compound: true },
  { name: "Superman Holds", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bird-Dog", compound: false },
  { name: "T-Bar Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Row", compound: true },
  { name: "Lat Pulldown (Neutral)", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Pull-Ups", compound: true },
  { name: "Good Mornings", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "RDL", compound: true },

  // === BICEPS ===
  { name: "Zottman Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Standard Curls", compound: false },
  { name: "Incline DB Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Hammer Curls", compound: false },
  { name: "EZ-Bar Preacher Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "EZ-Bar", alternative: "DB Concentration Curl", compound: false },
  { name: "Cable Bicep Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Resistance Band Curl", compound: false },
  { name: "Spider Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Hammer Curls", compound: false },
  { name: "Chin-Ups", bodyPart: "Biceps", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Lat Pulldown", compound: true },

  // === TRICEPS ===
  { name: "Skull Crushers", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Tricep Extensions", compound: false },
  { name: "Close-Grip Bench", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Diamond Push-ups", compound: true },
  { name: "Tricep Rope Pushdown", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Overhead DB Extension", compound: false },
  { name: "Bench Dips", bodyPart: "Triceps", location: "Home/Gym", category: "Bodyweight", equipment: "Bench", alternative: "Kickbacks", compound: true },
  { name: "Tate Press", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Floor Extensions", compound: false },
  { name: "Single Arm Extension", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Kickbacks", compound: false },

  // === SHOULDERS ===
  { name: "Arnold Press", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Overhead Press", compound: true },
  { name: "Lateral Raises", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Cable Lat Raise", compound: false },
  { name: "Face Pulls", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Rear Delt Flyes", compound: false },
  { name: "Front Plate Raise", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Plate/DB", alternative: "Front DB Raise", compound: false },
  { name: "Upright Row", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "High Pulls", compound: true },
  { name: "Reverse Flyes", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Face Pulls", compound: false },
  { name: "Shrugs", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Farmer's Carry", compound: false },

  // === LEGS ===
  { name: "Goblet Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Bodyweight Squat", compound: true },
  { name: "Barbell Back Squat", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Squat", compound: true },
  { name: "Walking Lunges", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Step-ups", compound: true },
  { name: "Leg Press", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Goblet Squat", compound: true },
  { name: "Bulgarian Split Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Lunges", compound: true },
  { name: "Leg Curls", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "DB Hamstring Curl", compound: false },
  { name: "Calf Raises", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Smith Machine Raise", compound: false },
  { name: "Glute Bridges", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Hip Thrusts", compound: true },
  { name: "Sumo Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Plie Squat", compound: true },
  { name: "Wall Sits", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "Wall", alternative: "Squat Hold", compound: false },

  // === ABS / CORE ===
  { name: "Plank", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Weighted Plank", compound: false },
  { name: "Hanging Leg Raises", bodyPart: "Abs/Core", location: "Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Knee Tucks", compound: false },
  { name: "Russian Twists", bodyPart: "Abs/Core", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Bicycle Crunches", compound: false },
  { name: "Dead Bugs", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bird-Dog", compound: false },
  { name: "Cable Woodchoppers", bodyPart: "Abs/Core", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Med Ball Twists", compound: false },
  { name: "Ab Wheel Rollout", bodyPart: "Abs/Core", location: "Home/Gym", category: "Equipment", equipment: "Ab Wheel", alternative: "Walk-outs", compound: false },
  { name: "Flutter Kicks", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Leg Raises", compound: false },

  // === CARDIO ===
  { name: "Mountain Climbers", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Burpees", compound: true },
  { name: "Burpees", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Jump Squats", compound: true },
  { name: "Jump Rope", bodyPart: "Cardio", location: "Home/Gym", category: "Equipment", equipment: "Rope", alternative: "Jumping Jacks", compound: true },
  { name: "Shadow Boxing", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "High Knees", compound: true },
  { name: "Battle Ropes", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Ropes", alternative: "Kettlebell Swings", compound: true },
  { name: "Assault Bike", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Rowing Machine", compound: true },
  { name: "Box Jumps", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "Box/Bench", alternative: "Tuck Jumps", compound: true },

  // === FULL BODY ===
  { name: "Bear Crawls", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Mountain Climbers", compound: true },
  { name: "Man-Makers", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Thrusters", compound: true },
];

// All unique body parts for the selector
export const BODY_PARTS = [
  "Chest", "Back", "Biceps", "Triceps", "Shoulders", "Legs", "Abs/Core", "Cardio", "Full Body"
];

// Goal configurations from agents.md
export const GOALS = {
  bulking: { label: "Bulking", repRange: "8–12", restSeconds: 90, focus: "Hypertrophy" },
  cutting: { label: "Cutting", repRange: "12–20", restSeconds: 35, focus: "Metabolic Stress" },
};

// Fitness level configurations
export const FITNESS_LEVELS = {
  beginner: { label: "Beginner", coefficient: 0.7 },
  intermediate: { label: "Intermediate", coefficient: 1.0 },
  advanced: { label: "Advanced", coefficient: 1.3 },
};

// Elite insights for workout cards
export const ELITE_INSIGHTS = [
  "Focus on the eccentric phase of the lift for maximum fiber recruitment.",
  "Control the negative — 3 seconds down builds more muscle than speed reps.",
  "Mind-muscle connection: visualize the target muscle contracting on every rep.",
  "Breathe out on exertion. Proper breathing amplifies force output by up to 20%.",
  "Progressive overload isn't just weight — tempo, volume, and range of motion all count.",
  "The last 2 reps are where growth happens. Push through the discomfort zone.",
  "Rest periods matter. Short rest = metabolic stress. Long rest = strength gains.",
  "Compound movements first. They recruit the most motor units for maximum growth.",
  "Squeeze at the peak contraction for 1 second. Isometric holds boost hypertrophy.",
  "Train the muscle, not the movement. Slow down and feel every fiber working.",
  "Supinate your wrist at the top of curls for a full bicep contraction.",
  "Keep your scapulae retracted during pressing movements to protect your shoulders.",
  "Drive through your heels on squats and deadlifts for maximum glute activation.",
  "Unilateral training exposes imbalances. Single-arm and single-leg work builds symmetry.",
  "Post-workout protein within 30 minutes maximizes the anabolic window.",
];

export default exercises;
