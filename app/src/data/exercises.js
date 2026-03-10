// Exercise database for Valor Training
// Source: Expanded Workout Options and Logic.xlsx

const exercises = [
  // === CHEST ===
  { name: "Incline DB Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Incline Push-Ups", compound: true , description: "Target the upper chest and shoulders with this pressing movement." },
  { name: "Flat Barbell Bench", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Chest Press", compound: true , description: "A fundamental compound lift for building overall chest mass and pushing power." },
  { name: "Decline Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Floor Press", compound: true , description: "Elevate your feet to emphasize the upper chest and shoulders." },
  { name: "Cable Crossover", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Flyes", compound: false , description: "A constant-tension isolation movement to sculpt the inner and lower chest." },
  { name: "Chest Dips", bodyPart: "Chest", location: "Gym", category: "Bodyweight", equipment: "Dip Bars", alternative: "Push-Ups", compound: true , description: "Lean forward slightly to target the lower chest and triceps." },
  { name: "Pec Deck Machine", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "DB Flyes", compound: false , description: "Isolate the pectoral muscles with strict form and a deep stretch." },
  { name: "Svend Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Floor Press", compound: false , description: "Squeeze the plates together to burn out the inner chest." },

  // === BACK ===
  { name: "One-Arm DB Row", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Gorilla Rows", compound: true , description: "Develop back thickness and correct muscle imbalances unilaterally." },
  { name: "Wide Grip Pull-Ups", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Lat Pulldown", compound: true , description: "Build a wider back and strong lats with this classic bodyweight pull." },
  { name: "Seated Cable Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Rows", compound: true , description: "Focus on the mid-back and rhomboids by pulling the handles to your stomach." },
  { name: "Deadlift (Conventional)", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB RDL", compound: true , description: "The ultimate full-body string builder targeting the posterior chain." },
  { name: "Superman Holds", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bird-Dog", compound: false , description: "Strengthen your lower back and core with this isometric hold." },
  { name: "T-Bar Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Row", compound: true , description: "Add mass to the mid-back by squeezing the shoulder blades at the top." },
  { name: "Lat Pulldown (Neutral)", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Pull-Ups", compound: true , description: "A pulldown variation to emphasize the lats with a neutral grip." },
  { name: "Good Mornings", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "RDL", compound: true , description: "Hinge at the hips to load the hamstrings and lower back." },

  // === BICEPS ===
  { name: "Zottman Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Standard Curls", compound: false , description: "Hit both the biceps and forearms by rotating your grip on the eccentric." },
  { name: "Incline DB Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Hammer Curls", compound: false , description: "Maximize the stretch on the long head of the bicep." },
  { name: "EZ-Bar Preacher Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "EZ-Bar", alternative: "DB Concentration Curl", compound: false , description: "Isolate the biceps and prevent momentum with a strict rested position." },
  { name: "Cable Bicep Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Resistance Band Curl", compound: false , description: "Keep constant tension on the biceps throughout the full range of motion." },
  { name: "Spider Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Hammer Curls", compound: false , description: "Lean over the bench to eliminate swinging and focus on the peak contraction." },
  { name: "Chin-Ups", bodyPart: "Biceps", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Lat Pulldown", compound: true , description: "An underhand grip bodyweight pull to heavily target the biceps and lats." },

  // === TRICEPS ===
  { name: "Skull Crushers", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Tricep Extensions", compound: false , description: "Isolate the triceps with strict elbow flexion and extension." },
  { name: "Close-Grip Bench", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Diamond Push-ups", compound: true , description: "A compound press that heavily shifts the load onto the triceps." },
  { name: "Tricep Rope Pushdown", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Overhead DB Extension", compound: false , description: "Pull the rope apart at the bottom for maximum tricep activation." },
  { name: "Bench Dips", bodyPart: "Triceps", location: "Home/Gym", category: "Bodyweight", equipment: "Bench", alternative: "Kickbacks", compound: true , description: "A convenient bodyweight movement to pump the triceps." },
  { name: "Tate Press", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Floor Extensions", compound: false , description: "Flare the elbows outward to target the lateral head of the tricep." },
  { name: "Single Arm Extension", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Kickbacks", compound: false , description: "Focus on one arm at a time to build symmetrical tricep strength." },

  // === SHOULDERS ===
  { name: "Arnold Press", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Overhead Press", compound: true , description: "A twisting overhead press to hit all three heads of the deltoids." },
  { name: "Lateral Raises", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Cable Lat Raise", compound: false , description: "The best movement for building wide, capped shoulders." },
  { name: "Face Pulls", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Rear Delt Flyes", compound: false , description: "Essential for rear deltoid development and shoulder health." },
  { name: "Front Plate Raise", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Plate/DB", alternative: "Front DB Raise", compound: false , description: "Isolate the front deltoids by raising the weight to eye level." },
  { name: "Upright Row", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "High Pulls", compound: true , description: "Pull the weight up along your body to build the traps and side delts." },
  { name: "Reverse Flyes", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Face Pulls", compound: false , description: "Target the often-neglected rear delts with a bent-over fly motion." },
  { name: "Shrugs", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Farmer's Carry", compound: false , description: "Isolate the trapezius muscles for a thicker neck and upper back." },

  // === LEGS ===
  { name: "Goblet Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Bodyweight Squat", compound: true , description: "An anterior-loaded squat to build quad strength and improve mobility." },
  { name: "Barbell Back Squat", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Squat", compound: true , description: "The king of lower body exercises for overall leg mass and power." },
  { name: "Walking Lunges", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Step-ups", compound: true , description: "A dynamic unilateral movement to challenge the quads and glutes." },
  { name: "Leg Press", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Goblet Squat", compound: true , description: "Load up the lower body safely while supporting your lower back." },
  { name: "Bulgarian Split Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Lunges", compound: true , description: "An intense single-leg squat for deep glute and quad engagement." },
  { name: "Leg Curls", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "DB Hamstring Curl", compound: false , description: "Isolate the hamstrings with strict knee flexion." },
  { name: "Calf Raises", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Smith Machine Raise", compound: false , description: "Push through the toes to build the gastrocnemius and soleus." },
  { name: "Glute Bridges", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Hip Thrusts", compound: true , description: "Squeeze at the top to maximally engage the gluteus maximus." },
  { name: "Sumo Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Plie Squat", compound: true , description: "A wide-stance squat to hit the adductors, glutes, and inner thighs." },
  { name: "Wall Sits", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "Wall", alternative: "Squat Hold", compound: false , description: "An isometric leg burner to build quad endurance and mental toughness." },

  // === ABS / CORE ===
  { name: "Plank", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Weighted Plank", compound: false , description: "Brace your core to build deep transverse abdominis strength." },
  { name: "Hanging Leg Raises", bodyPart: "Abs/Core", location: "Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Knee Tucks", compound: false , description: "A challenging lower ab movement performed from a dead hang." },
  { name: "Russian Twists", bodyPart: "Abs/Core", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Bicycle Crunches", compound: false , description: "Rotate the torso to target the obliques and core stabilizers." },
  { name: "Dead Bugs", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bird-Dog", compound: false , description: "A low-impact core exercise for coordination and stability." },
  { name: "Cable Woodchoppers", bodyPart: "Abs/Core", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Med Ball Twists", compound: false , description: "A functional rotational movement for core power." },
  { name: "Ab Wheel Rollout", bodyPart: "Abs/Core", location: "Home/Gym", category: "Equipment", equipment: "Ab Wheel", alternative: "Walk-outs", compound: false , description: "An advanced core movement that challenges anti-extension strength." },
  { name: "Flutter Kicks", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Leg Raises", compound: false , description: "A continuous lower-ab burner to build endurance." },

  // === CARDIO ===
  { name: "Mountain Climbers", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Burpees", compound: true , description: "A fast-paced core and cardio drill." },
  { name: "Burpees", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Jump Squats", compound: true , description: "A full-body explosive movement for maximum heart rate elevation." },
  { name: "Jump Rope", bodyPart: "Cardio", location: "Home/Gym", category: "Equipment", equipment: "Rope", alternative: "Jumping Jacks", compound: true , description: "A classic conditioning tool for agility and footwork." },
  { name: "Shadow Boxing", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "High Knees", compound: true , description: "Keep the hands moving and core tight for steady-state cardio." },
  { name: "Battle Ropes", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Ropes", alternative: "Kettlebell Swings", compound: true , description: "An intense upper body cardio blast." },
  { name: "Assault Bike", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Rowing Machine", compound: true , description: "A full-body machine sprint to build anaerobic capacity." },
  { name: "Box Jumps", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "Box/Bench", alternative: "Tuck Jumps", compound: true , description: "Build explosive lower body power and vertical jump." },

  // === FULL BODY ===
  { name: "Bear Crawls", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Mountain Climbers", compound: true , description: "A functional movement for full body stability and coordination." },
  { name: "Man-Makers", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Thrusters", compound: true , description: "A grueling combination of push-ups, rows, and overhead presses." },
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
