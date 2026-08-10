// Exercise database for Valor Training
// Source: Expanded Workout Options and Logic.xlsx
//
// difficulty gates which movements a fitness level is offered — a beginner
// shouldn't be handed a conventional deadlift or a pistol squat.

const exercises = [
  // === CHEST ===
  { name: "Incline DB Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Incline Push-Ups", compound: true, difficulty: "beginner", description: "Target the upper chest and shoulders with this pressing movement." },
  { name: "Flat Barbell Bench", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Chest Press", compound: true, difficulty: "intermediate", description: "A fundamental compound lift for building overall chest mass and pushing power." },
  { name: "Decline Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Floor Press", compound: true, difficulty: "intermediate", description: "Elevate your feet to emphasize the upper chest and shoulders." },
  { name: "Cable Crossover", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Flyes", compound: false, difficulty: "intermediate", description: "A constant-tension isolation movement to sculpt the inner and lower chest." },
  { name: "Chest Dips", bodyPart: "Chest", location: "Gym", category: "Bodyweight", equipment: "Dip Bars", alternative: "Push-Ups", compound: true, difficulty: "advanced", description: "Lean forward slightly to target the lower chest and triceps." },
  { name: "Pec Deck Machine", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "DB Flyes", compound: false, difficulty: "beginner", description: "Isolate the pectoral muscles with strict form and a deep stretch." },
  { name: "Svend Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Floor Press", compound: false, difficulty: "beginner", description: "Squeeze the plates together to burn out the inner chest." },
  { name: "Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Knee Push-Ups", compound: true, difficulty: "beginner", description: "The foundational pressing movement — keep a straight line from head to heels." },
  { name: "Knee Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Wall Push-Ups", compound: true, difficulty: "beginner", description: "A scaled push-up that builds pressing strength from the ground up." },
  { name: "Incline Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Knee Push-Ups", compound: true, difficulty: "beginner", description: "Hands elevated to reduce load — ideal for building volume." },
  { name: "DB Floor Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "DB Chest Press", compound: true, difficulty: "beginner", description: "The floor limits range of motion, protecting the shoulders while loading the triceps." },
  { name: "DB Chest Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Push-Ups", compound: true, difficulty: "beginner", description: "A dumbbell press allowing a deeper stretch than the barbell." },
  { name: "DB Flyes", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Cable Crossover", compound: false, difficulty: "intermediate", description: "Keep a soft elbow bend and open the chest wide for a deep stretch." },
  { name: "Incline Barbell Bench", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Incline DB Press", compound: true, difficulty: "intermediate", description: "A 30-degree incline shifts the load onto the clavicular head of the chest." },
  { name: "Decline Barbell Bench", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Chest Dips", compound: true, difficulty: "advanced", description: "Emphasize the lower chest with a declined pressing angle." },
  { name: "Machine Chest Press", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "DB Chest Press", compound: true, difficulty: "beginner", description: "A guided press that lets you push hard without a spotter." },
  { name: "Low Cable Fly", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Flyes", compound: false, difficulty: "intermediate", description: "Drive the handles up and together to target the upper chest fibers." },
  { name: "Diamond Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Close-Grip Bench", compound: true, difficulty: "intermediate", description: "Hands close together to shift the emphasis onto the inner chest and triceps." },
  { name: "Archer Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Decline Push-Ups", compound: true, difficulty: "advanced", description: "Shift your weight to one arm at a time — a bridge to the one-arm push-up." },
  { name: "Plyo Push-Ups", bodyPart: "Chest", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Push-Ups", compound: true, difficulty: "advanced", description: "Explode off the floor to develop upper body power." },
  { name: "Squeeze Press", bodyPart: "Chest", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Svend Press", compound: true, difficulty: "beginner", description: "Press two dumbbells together throughout to maximize inner chest tension." },
  { name: "Guillotine Press", bodyPart: "Chest", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Flat Barbell Bench", compound: true, difficulty: "advanced", description: "Flare the elbows and lower toward the neck for extreme upper-chest stretch." },

  // === BACK ===
  { name: "One-Arm DB Row", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Gorilla Rows", compound: true, difficulty: "beginner", description: "Develop back thickness and correct muscle imbalances unilaterally." },
  { name: "Wide Grip Pull-Ups", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Lat Pulldown", compound: true, difficulty: "advanced", description: "Build a wider back and strong lats with this classic bodyweight pull." },
  { name: "Seated Cable Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Rows", compound: true, difficulty: "beginner", description: "Focus on the mid-back and rhomboids by pulling the handles to your stomach." },
  { name: "Deadlift (Conventional)", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB RDL", compound: true, difficulty: "advanced", description: "The ultimate full-body strength builder targeting the posterior chain." },
  { name: "Superman Holds", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bird-Dog", compound: false, difficulty: "beginner", description: "Strengthen your lower back and core with this isometric hold." },
  { name: "T-Bar Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Row", compound: true, difficulty: "intermediate", description: "Add mass to the mid-back by squeezing the shoulder blades at the top." },
  { name: "Lat Pulldown (Neutral)", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Pull-Ups", compound: true, difficulty: "beginner", description: "A pulldown variation to emphasize the lats with a neutral grip." },
  { name: "Good Mornings", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "RDL", compound: true, difficulty: "advanced", description: "Hinge at the hips to load the hamstrings and lower back." },
  { name: "Bird-Dog", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Superman Holds", compound: false, difficulty: "beginner", description: "Extend the opposite arm and leg to train spinal stability." },
  { name: "Inverted Rows", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "One-Arm DB Row", compound: true, difficulty: "beginner", description: "A horizontal bodyweight pull — the row counterpart to the push-up." },
  { name: "Bent-Over Barbell Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "One-Arm DB Row", compound: true, difficulty: "intermediate", description: "Hinge forward and row to the navel for total mid-back development." },
  { name: "Gorilla Rows", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "One-Arm DB Row", compound: true, difficulty: "intermediate", description: "Alternate rows from a hinged stance, bracing hard between reps." },
  { name: "Chest-Supported Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Seated Cable Row", compound: true, difficulty: "beginner", description: "The bench removes lower-back strain so the lats do all the work." },
  { name: "Straight-Arm Pulldown", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "DB Pullover", compound: false, difficulty: "intermediate", description: "One of the few true lat isolation movements — keep the elbows locked." },
  { name: "DB Pullover", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Straight-Arm Pulldown", compound: false, difficulty: "intermediate", description: "Stretch the lats overhead and pull the weight across in an arc." },
  { name: "Renegade Rows", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "One-Arm DB Row", compound: true, difficulty: "advanced", description: "Row from a plank position — the anti-rotation demand hammers the core." },
  { name: "Meadows Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "One-Arm DB Row", compound: true, difficulty: "advanced", description: "A landmine row from a staggered stance for deep unilateral stretch." },
  { name: "Seal Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Chest-Supported Row", compound: true, difficulty: "intermediate", description: "Lying face down eliminates all momentum from the row." },
  { name: "Rack Pulls", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Deadlift (Conventional)", compound: true, difficulty: "intermediate", description: "A partial deadlift from knee height to overload the upper back and traps." },
  { name: "Single-Arm Lat Pulldown", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Lat Pulldown (Neutral)", compound: true, difficulty: "beginner", description: "Train one lat at a time for a longer range and better contraction." },
  { name: "Band Pull-Aparts", bodyPart: "Back", location: "Home/Gym", category: "Equipment", equipment: "Rope", alternative: "Reverse Flyes", compound: false, difficulty: "beginner", description: "High-rep upper back work that reinforces good posture." },
  { name: "Reverse Grip Row", bodyPart: "Back", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Bent-Over Barbell Row", compound: true, difficulty: "intermediate", description: "An underhand grip recruits the lower lats and biceps more heavily." },
  { name: "Kettlebell Swings", bodyPart: "Back", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Good Mornings", compound: true, difficulty: "intermediate", description: "An explosive hip hinge that builds the entire posterior chain." },
  { name: "Towel Pull-Ups", bodyPart: "Back", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Wide Grip Pull-Ups", compound: true, difficulty: "advanced", description: "Grip a towel over the bar to punish the forearms alongside the lats." },

  // === BICEPS ===
  { name: "Zottman Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Standard Curls", compound: false, difficulty: "intermediate", description: "Hit both the biceps and forearms by rotating your grip on the eccentric." },
  { name: "Incline DB Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Hammer Curls", compound: false, difficulty: "intermediate", description: "Maximize the stretch on the long head of the bicep." },
  { name: "EZ-Bar Preacher Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "EZ-Bar", alternative: "DB Concentration Curl", compound: false, difficulty: "intermediate", description: "Isolate the biceps and prevent momentum with a strict rested position." },
  { name: "Cable Bicep Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Resistance Band Curl", compound: false, difficulty: "beginner", description: "Keep constant tension on the biceps throughout the full range of motion." },
  { name: "Spider Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Hammer Curls", compound: false, difficulty: "intermediate", description: "Lean over the bench to eliminate swinging and focus on the peak contraction." },
  { name: "Chin-Ups", bodyPart: "Biceps", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Lat Pulldown", compound: true, difficulty: "advanced", description: "An underhand grip bodyweight pull to heavily target the biceps and lats." },
  { name: "Standard DB Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Hammer Curls", compound: false, difficulty: "beginner", description: "The classic curl — keep the elbows pinned to your sides." },
  { name: "Hammer Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Standard DB Curls", compound: false, difficulty: "beginner", description: "A neutral grip that builds the brachialis and thickens the arm." },
  { name: "DB Concentration Curl", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Spider Curls", compound: false, difficulty: "beginner", description: "Brace the elbow against your thigh and squeeze hard at the top." },
  { name: "Barbell Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Standard DB Curls", compound: false, difficulty: "beginner", description: "Load the biceps heavier than dumbbells allow with a straight bar." },
  { name: "Reverse Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Zottman Curls", compound: false, difficulty: "intermediate", description: "An overhand grip that shifts the work to the forearm extensors." },
  { name: "Cross-Body Hammer Curl", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Hammer Curls", compound: false, difficulty: "beginner", description: "Curl across the torso to bias the brachialis and outer arm." },
  { name: "21s Curl", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Barbell Curl", compound: false, difficulty: "intermediate", description: "Seven bottom-half, seven top-half, seven full reps — a brutal pump finisher." },
  { name: "Bayesian Cable Curl", bodyPart: "Biceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Incline DB Curls", compound: false, difficulty: "advanced", description: "Face away from the stack to load the long head in a deep stretch." },
  { name: "Isometric Curl Hold", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "DB Concentration Curl", compound: false, difficulty: "beginner", description: "Hold at 90 degrees and fight the shake — pure time under tension." },
  { name: "Drag Curls", bodyPart: "Biceps", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Barbell Curl", compound: false, difficulty: "intermediate", description: "Drag the bar up your torso, driving the elbows back for a peak squeeze." },

  // === TRICEPS ===
  { name: "Skull Crushers", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Tricep Extensions", compound: false, difficulty: "intermediate", description: "Isolate the triceps with strict elbow flexion and extension." },
  { name: "Close-Grip Bench", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Diamond Push-ups", compound: true, difficulty: "intermediate", description: "A compound press that heavily shifts the load onto the triceps." },
  { name: "Tricep Rope Pushdown", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Overhead DB Extension", compound: false, difficulty: "beginner", description: "Pull the rope apart at the bottom for maximum tricep activation." },
  { name: "Bench Dips", bodyPart: "Triceps", location: "Home/Gym", category: "Bodyweight", equipment: "Bench", alternative: "Kickbacks", compound: true, difficulty: "beginner", description: "A convenient bodyweight movement to pump the triceps." },
  { name: "Tate Press", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Floor Extensions", compound: false, difficulty: "advanced", description: "Flare the elbows outward to target the lateral head of the tricep." },
  { name: "Single Arm Extension", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Kickbacks", compound: false, difficulty: "beginner", description: "Focus on one arm at a time to build symmetrical tricep strength." },
  { name: "Overhead DB Extension", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Single Arm Extension", compound: false, difficulty: "beginner", description: "Overhead position places the long head under a deep stretch." },
  { name: "Tricep Kickbacks", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Tricep Rope Pushdown", compound: false, difficulty: "beginner", description: "Lock the upper arm parallel to the floor and extend fully." },
  { name: "Floor Extensions", bodyPart: "Triceps", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Skull Crushers", compound: false, difficulty: "beginner", description: "A skull crusher from the floor, safer on the elbows and shoulders." },
  { name: "Straight Bar Pushdown", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Tricep Rope Pushdown", compound: false, difficulty: "beginner", description: "A straight bar lets you overload the lateral head heavier than a rope." },
  { name: "Overhead Cable Extension", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Overhead DB Extension", compound: false, difficulty: "intermediate", description: "Constant tension through the deepest part of the long head stretch." },
  { name: "Triceps Dips (Bars)", bodyPart: "Triceps", location: "Gym", category: "Bodyweight", equipment: "Dip Bars", alternative: "Bench Dips", compound: true, difficulty: "advanced", description: "Stay upright and vertical to keep the load on the triceps, not the chest." },
  { name: "JM Press", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Close-Grip Bench", compound: true, difficulty: "advanced", description: "A hybrid of a close-grip press and a skull crusher, favored by powerlifters." },
  { name: "Wall Tricep Extension", bodyPart: "Triceps", location: "Home/Gym", category: "Bodyweight", equipment: "Wall", alternative: "Diamond Push-Ups", compound: false, difficulty: "beginner", description: "Lean into a wall and extend at the elbows — zero equipment needed." },
  { name: "Close-Grip Push-Ups", bodyPart: "Triceps", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Diamond Push-Ups", compound: true, difficulty: "beginner", description: "Narrow hand placement puts the triceps in the driver's seat." },
  { name: "Bodyweight Skull Crusher", bodyPart: "Triceps", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Skull Crushers", compound: false, difficulty: "advanced", description: "Lower your head toward the bar and press back — brutally hard, no weights." },
  { name: "Cable Kickback", bodyPart: "Triceps", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Tricep Kickbacks", compound: false, difficulty: "beginner", description: "Cables hold tension at full lockout where dumbbells lose it." },
  { name: "Diamond Push-ups", bodyPart: "Triceps", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Close-Grip Push-Ups", compound: true, difficulty: "intermediate", description: "Form a diamond with your hands to maximally recruit the triceps." },

  // === SHOULDERS ===
  { name: "Arnold Press", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Overhead Press", compound: true, difficulty: "intermediate", description: "A twisting overhead press to hit all three heads of the deltoids." },
  { name: "Lateral Raises", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Cable Lat Raise", compound: false, difficulty: "beginner", description: "The best movement for building wide, capped shoulders." },
  { name: "Face Pulls", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Rear Delt Flyes", compound: false, difficulty: "beginner", description: "Essential for rear deltoid development and shoulder health." },
  { name: "Front Plate Raise", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Plate/DB", alternative: "Front DB Raise", compound: false, difficulty: "beginner", description: "Isolate the front deltoids by raising the weight to eye level." },
  { name: "Upright Row", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "High Pulls", compound: true, difficulty: "intermediate", description: "Pull the weight up along your body to build the traps and side delts." },
  { name: "Reverse Flyes", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Face Pulls", compound: false, difficulty: "beginner", description: "Target the often-neglected rear delts with a bent-over fly motion." },
  { name: "Shrugs", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Farmer's Carry", compound: false, difficulty: "beginner", description: "Isolate the trapezius muscles for a thicker neck and upper back." },
  { name: "Overhead Press", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Arnold Press", compound: true, difficulty: "beginner", description: "Press straight overhead, bracing the core to protect the lower back." },
  { name: "Standing Barbell Press", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Overhead Press", compound: true, difficulty: "intermediate", description: "The heaviest overhead pressing option for raw shoulder strength." },
  { name: "Seated DB Press", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Overhead Press", compound: true, difficulty: "beginner", description: "Back supported so the delts work without lower-back involvement." },
  { name: "Cable Lat Raise", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Lateral Raises", compound: false, difficulty: "intermediate", description: "Constant tension at the bottom where dumbbells go slack." },
  { name: "Front DB Raise", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Front Plate Raise", compound: false, difficulty: "beginner", description: "Raise to shoulder height with control — no swinging." },
  { name: "Rear Delt Flyes", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Face Pulls", compound: false, difficulty: "beginner", description: "Hinge forward and sweep the arms wide to isolate the rear delts." },
  { name: "Pike Push-Ups", bodyPart: "Shoulders", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Overhead Press", compound: true, difficulty: "intermediate", description: "Hips high, press through the shoulders — a bodyweight overhead press." },
  { name: "Handstand Push-Ups", bodyPart: "Shoulders", location: "Home/Gym", category: "Bodyweight", equipment: "Wall", alternative: "Pike Push-Ups", compound: true, difficulty: "advanced", description: "The pinnacle of bodyweight shoulder pressing — use a wall for balance." },
  { name: "Machine Shoulder Press", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Seated DB Press", compound: true, difficulty: "beginner", description: "A fixed path press to safely push the delts to failure." },
  { name: "Lean-Away Lateral Raise", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Lateral Raises", compound: false, difficulty: "intermediate", description: "Lean away from a support to lengthen the side delt's range." },
  { name: "High Pulls", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Upright Row", compound: true, difficulty: "advanced", description: "An explosive pull to the collarbone that builds traps and power." },
  { name: "Farmer's Carry", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Shrugs", compound: true, difficulty: "beginner", description: "Walk heavy with braced shoulders — builds traps, grip, and core." },
  { name: "Cuban Rotation", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Face Pulls", compound: false, difficulty: "intermediate", description: "External rotation work that bulletproofs the rotator cuff." },
  { name: "Y-Raises", bodyPart: "Shoulders", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Front DB Raise", compound: false, difficulty: "beginner", description: "Raise the arms into a Y to hit the lower traps and rear delts." },
  { name: "Behind-the-Neck Press", bodyPart: "Shoulders", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Standing Barbell Press", compound: true, difficulty: "advanced", description: "Demands serious shoulder mobility — go light and controlled." },

  // === LEGS ===
  { name: "Goblet Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Bodyweight Squat", compound: true, difficulty: "beginner", description: "An anterior-loaded squat to build quad strength and improve mobility." },
  { name: "Barbell Back Squat", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "DB Squat", compound: true, difficulty: "intermediate", description: "The king of lower body exercises for overall leg mass and power." },
  { name: "Walking Lunges", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Step-ups", compound: true, difficulty: "beginner", description: "A dynamic unilateral movement to challenge the quads and glutes." },
  { name: "Leg Press", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Goblet Squat", compound: true, difficulty: "beginner", description: "Load up the lower body safely while supporting your lower back." },
  { name: "Bulgarian Split Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Lunges", compound: true, difficulty: "advanced", description: "An intense single-leg squat for deep glute and quad engagement." },
  { name: "Leg Curls", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "DB Hamstring Curl", compound: false, difficulty: "beginner", description: "Isolate the hamstrings with strict knee flexion." },
  { name: "Calf Raises", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Smith Machine Raise", compound: false, difficulty: "beginner", description: "Push through the toes to build the gastrocnemius and soleus." },
  { name: "Glute Bridges", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Hip Thrusts", compound: true, difficulty: "beginner", description: "Squeeze at the top to maximally engage the gluteus maximus." },
  { name: "Sumo Squat", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Plie Squat", compound: true, difficulty: "beginner", description: "A wide-stance squat to hit the adductors, glutes, and inner thighs." },
  { name: "Wall Sits", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "Wall", alternative: "Squat Hold", compound: false, difficulty: "beginner", description: "An isometric leg burner to build quad endurance and mental toughness." },
  { name: "Bodyweight Squat", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Goblet Squat", compound: true, difficulty: "beginner", description: "Master the squat pattern before adding load — depth over speed." },
  { name: "Romanian Deadlift", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Barbell", alternative: "Good Mornings", compound: true, difficulty: "intermediate", description: "Push the hips back with a flat back to load the hamstrings hard." },
  { name: "Hip Thrusts", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB + Bench", alternative: "Glute Bridges", compound: true, difficulty: "intermediate", description: "The single best glute builder — pause and squeeze at lockout." },
  { name: "Step-ups", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Box/Bench", alternative: "Walking Lunges", compound: true, difficulty: "beginner", description: "Drive through the lead heel and control the descent." },
  { name: "Front Squat", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Goblet Squat", compound: true, difficulty: "advanced", description: "An upright torso shifts the demand onto the quads and upper back." },
  { name: "Hack Squat", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Leg Press", compound: true, difficulty: "intermediate", description: "A guided squat that isolates the quads with the back supported." },
  { name: "Leg Extensions", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Wall Sits", compound: false, difficulty: "beginner", description: "Pure quad isolation — pause at the top for a hard contraction." },
  { name: "Seated Calf Raise", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Calf Raises", compound: false, difficulty: "beginner", description: "A bent knee shifts the work to the soleus beneath the calf." },
  { name: "DB Hamstring Curl", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Leg Curls", compound: false, difficulty: "beginner", description: "Pin a dumbbell between the feet and curl toward the glutes." },
  { name: "Nordic Curl", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Leg Curls", compound: false, difficulty: "advanced", description: "Lower under control from the knees — the hardest hamstring movement there is." },
  { name: "Reverse Lunges", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Walking Lunges", compound: true, difficulty: "beginner", description: "Stepping back is easier on the knees than stepping forward." },
  { name: "Lateral Lunges", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Sumo Squat", compound: true, difficulty: "intermediate", description: "Move sideways to train the adductors and frontal-plane stability." },
  { name: "Curtsy Lunges", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "DB/Bodyweight", alternative: "Reverse Lunges", compound: true, difficulty: "intermediate", description: "Cross behind to bias the gluteus medius and outer hip." },
  { name: "Pistol Squat", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bulgarian Split Squat", compound: true, difficulty: "advanced", description: "A full single-leg squat demanding strength, balance, and mobility." },
  { name: "Jump Squats", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bodyweight Squat", compound: true, difficulty: "intermediate", description: "Explode upward and land soft to develop lower body power." },
  { name: "Single-Leg RDL", bodyPart: "Legs", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Romanian Deadlift", compound: true, difficulty: "advanced", description: "Hinge on one leg — exposes imbalances and builds hamstring control." },
  { name: "Sumo Deadlift", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Romanian Deadlift", compound: true, difficulty: "advanced", description: "A wide stance shortens the pull and loads the quads and adductors." },
  { name: "Standing Calf Raise", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Calf Raises", compound: false, difficulty: "beginner", description: "Full stretch at the bottom, full contraction at the top." },
  { name: "Frog Pumps", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Glute Bridges", compound: false, difficulty: "beginner", description: "Soles together, knees wide — a high-rep glute burner." },
  { name: "Cossack Squat", bodyPart: "Legs", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Lateral Lunges", compound: true, difficulty: "advanced", description: "A deep lateral squat that builds mobility alongside strength." },
  { name: "Box Squat", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Barbell Back Squat", compound: true, difficulty: "beginner", description: "Sit to a box to groove consistent depth and build confidence." },
  { name: "Smith Machine Raise", bodyPart: "Legs", location: "Gym", category: "Weighted", equipment: "Machine", alternative: "Calf Raises", compound: false, difficulty: "beginner", description: "A fixed bar path lets you load calves heavy without balance issues." },

  // === ABS / CORE ===
  { name: "Plank", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Weighted Plank", compound: false, difficulty: "beginner", description: "Brace your core to build deep transverse abdominis strength." },
  { name: "Hanging Leg Raises", bodyPart: "Abs/Core", location: "Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Knee Tucks", compound: false, difficulty: "advanced", description: "A challenging lower ab movement performed from a dead hang." },
  { name: "Russian Twists", bodyPart: "Abs/Core", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Bicycle Crunches", compound: false, difficulty: "beginner", description: "Rotate the torso to target the obliques and core stabilizers." },
  { name: "Dead Bugs", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bird-Dog", compound: false, difficulty: "beginner", description: "A low-impact core exercise for coordination and stability." },
  { name: "Cable Woodchoppers", bodyPart: "Abs/Core", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Med Ball Twists", compound: false, difficulty: "intermediate", description: "A functional rotational movement for core power." },
  { name: "Ab Wheel Rollout", bodyPart: "Abs/Core", location: "Home/Gym", category: "Equipment", equipment: "Ab Wheel", alternative: "Walk-outs", compound: false, difficulty: "advanced", description: "An advanced core movement that challenges anti-extension strength." },
  { name: "Flutter Kicks", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Leg Raises", compound: false, difficulty: "beginner", description: "A continuous lower-ab burner to build endurance." },
  { name: "Crunches", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Sit-Ups", compound: false, difficulty: "beginner", description: "Curl the ribcage toward the pelvis — short range, hard squeeze." },
  { name: "Bicycle Crunches", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Russian Twists", compound: false, difficulty: "beginner", description: "Alternate elbow to opposite knee to bring the obliques in." },
  { name: "Lying Leg Raises", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Hanging Leg Raises", compound: false, difficulty: "beginner", description: "Press the lower back down and lift the legs with control." },
  { name: "Side Plank", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Plank", compound: false, difficulty: "beginner", description: "Stack the hips and hold — direct oblique and lateral-chain work." },
  { name: "Mountain Climber Twists", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bicycle Crunches", compound: false, difficulty: "intermediate", description: "Drive the knee to the opposite elbow for rotational core work." },
  { name: "Knee Tucks", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Lying Leg Raises", compound: false, difficulty: "beginner", description: "Pull the knees to the chest from a seated V — a lower-ab staple." },
  { name: "Hollow Body Hold", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Plank", compound: false, difficulty: "intermediate", description: "The gymnastics standard for total anterior core tension." },
  { name: "V-Ups", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Sit-Ups", compound: false, difficulty: "intermediate", description: "Fold at the hips, reaching hands to toes in one controlled motion." },
  { name: "Toes to Bar", bodyPart: "Abs/Core", location: "Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Hanging Leg Raises", compound: false, difficulty: "advanced", description: "Bring the toes all the way to the bar with minimal swing." },
  { name: "Weighted Plank", bodyPart: "Abs/Core", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Plank", compound: false, difficulty: "intermediate", description: "Add a plate to the upper back to progress the standard plank." },
  { name: "Pallof Press", bodyPart: "Abs/Core", location: "Gym", category: "Weighted", equipment: "Cable Machine", alternative: "Dead Bugs", compound: false, difficulty: "intermediate", description: "Resist rotation as you press out — pure anti-rotation strength." },
  { name: "Sit-Ups", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Crunches", compound: false, difficulty: "beginner", description: "Full trunk flexion — anchor the feet if you need to." },
  { name: "Med Ball Twists", bodyPart: "Abs/Core", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Russian Twists", compound: false, difficulty: "beginner", description: "Rotate side to side with a weight held at chest height." },
  { name: "Walk-outs", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Ab Wheel Rollout", compound: false, difficulty: "intermediate", description: "Walk the hands out to a plank and back, resisting hip sag." },
  { name: "Reverse Crunch", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Knee Tucks", compound: false, difficulty: "beginner", description: "Curl the pelvis toward the ribs — targets the lower abs directly." },
  { name: "Dragon Flag", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Hollow Body Hold", compound: false, difficulty: "advanced", description: "Lower the whole body as a rigid plank — an elite core feat." },
  { name: "Copenhagen Plank", bodyPart: "Abs/Core", location: "Home/Gym", category: "Bodyweight", equipment: "Bench/Chair", alternative: "Side Plank", compound: false, difficulty: "advanced", description: "A side plank from the top leg — brutal adductor and oblique work." },

  // === CARDIO ===
  { name: "Mountain Climbers", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Burpees", compound: true, difficulty: "beginner", description: "A fast-paced core and cardio drill." },
  { name: "Burpees", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Jump Squats", compound: true, difficulty: "intermediate", description: "A full-body explosive movement for maximum heart rate elevation." },
  { name: "Jump Rope", bodyPart: "Cardio", location: "Home/Gym", category: "Equipment", equipment: "Rope", alternative: "Jumping Jacks", compound: true, difficulty: "beginner", description: "A classic conditioning tool for agility and footwork." },
  { name: "Shadow Boxing", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "High Knees", compound: true, difficulty: "beginner", description: "Keep the hands moving and core tight for steady-state cardio." },
  { name: "Battle Ropes", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Ropes", alternative: "Kettlebell Swings", compound: true, difficulty: "intermediate", description: "An intense upper body cardio blast." },
  { name: "Assault Bike", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Rowing Machine", compound: true, difficulty: "intermediate", description: "A full-body machine sprint to build anaerobic capacity." },
  { name: "Box Jumps", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "Box/Bench", alternative: "Tuck Jumps", compound: true, difficulty: "intermediate", description: "Build explosive lower body power and vertical jump." },
  { name: "Jumping Jacks", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "High Knees", compound: true, difficulty: "beginner", description: "A simple full-body warm-up and conditioning staple." },
  { name: "High Knees", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Mountain Climbers", compound: true, difficulty: "beginner", description: "Drive the knees above hip height at a sprint cadence." },
  { name: "Rowing Machine", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Assault Bike", compound: true, difficulty: "beginner", description: "Legs, then back, then arms — the most efficient full-body cardio." },
  { name: "Tuck Jumps", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Jump Squats", compound: true, difficulty: "advanced", description: "Pull the knees to the chest mid-air and land soft." },
  { name: "Skater Jumps", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Jumping Jacks", compound: true, difficulty: "intermediate", description: "Bound side to side to train lateral power and single-leg control." },
  { name: "Treadmill Sprints", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Assault Bike", compound: true, difficulty: "intermediate", description: "Short maximal efforts with walking recovery between rounds." },
  { name: "Stair Climber", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Step-ups", compound: true, difficulty: "beginner", description: "Steady-state climbing that hammers the glutes and calves." },
  { name: "Bear Crawl Sprints", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Mountain Climbers", compound: true, difficulty: "intermediate", description: "Crawl fast with the knees just off the floor — deceptively brutal." },
  { name: "Butt Kicks", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "High Knees", compound: true, difficulty: "beginner", description: "Heels to glutes at pace — a running warm-up and conditioning tool." },
  { name: "Lateral Shuffles", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Skater Jumps", compound: true, difficulty: "beginner", description: "Stay low and shuffle side to side in an athletic stance." },
  { name: "Sled Push", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Bear Crawl Sprints", compound: true, difficulty: "advanced", description: "Drive a loaded sled — maximum conditioning with zero eccentric damage." },
  { name: "Jump Rope Double Unders", bodyPart: "Cardio", location: "Home/Gym", category: "Equipment", equipment: "Rope", alternative: "Jump Rope", compound: true, difficulty: "advanced", description: "Two rope passes per jump — demands timing and serious calf endurance." },
  { name: "Squat Thrusts", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Burpees", compound: true, difficulty: "beginner", description: "A burpee without the jump or push-up — accessible and effective." },
  { name: "Elliptical Intervals", bodyPart: "Cardio", location: "Gym", category: "Equipment", equipment: "Machine", alternative: "Rowing Machine", compound: true, difficulty: "beginner", description: "Low-impact intervals that spare the knees and ankles." },
  { name: "Broad Jumps", bodyPart: "Cardio", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Box Jumps", compound: true, difficulty: "advanced", description: "Jump forward for maximum distance, absorbing the landing." },

  // === FULL BODY ===
  { name: "Bear Crawls", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Mountain Climbers", compound: true, difficulty: "beginner", description: "A functional movement for full body stability and coordination." },
  { name: "Man-Makers", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Thrusters", compound: true, difficulty: "advanced", description: "A grueling combination of push-ups, rows, and overhead presses." },
  { name: "Thrusters", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Man-Makers", compound: true, difficulty: "intermediate", description: "A front squat flowing straight into an overhead press." },
  { name: "Clean and Press", bodyPart: "Full Body", location: "Gym", category: "Weighted", equipment: "Barbell", alternative: "Thrusters", compound: true, difficulty: "advanced", description: "Pull from the floor to the shoulders, then drive overhead." },
  { name: "Turkish Get-Up", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Man-Makers", compound: true, difficulty: "advanced", description: "Stand up from the floor with a weight locked overhead — total body control." },
  { name: "Devil's Press", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Man-Makers", compound: true, difficulty: "advanced", description: "A burpee into a swing-to-overhead — one of the hardest movements there is." },
  { name: "DB Snatch", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Kettlebell Swings", compound: true, difficulty: "advanced", description: "Explode from the floor to overhead in one continuous pull." },
  { name: "Wall Balls", bodyPart: "Full Body", location: "Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Thrusters", compound: true, difficulty: "intermediate", description: "Squat and throw to a target — legs, shoulders, and lungs together." },
  { name: "Inchworm", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Walk-outs", compound: true, difficulty: "beginner", description: "Walk the hands out, do a push-up, walk the feet in — mobility plus strength." },
  { name: "Squat to Press", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Thrusters", compound: true, difficulty: "beginner", description: "A controlled squat and press — the accessible entry to full body work." },
  { name: "Crab Walk", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Bear Crawls", compound: true, difficulty: "beginner", description: "Reverse tabletop travel that lights up the triceps and glutes." },
  { name: "Burpee Pull-Up", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "Pull-up Bar", alternative: "Burpees", compound: true, difficulty: "advanced", description: "A burpee finishing with a pull-up — the ultimate conditioning pairing." },
  { name: "Sandbag Carry", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Farmer's Carry", compound: true, difficulty: "intermediate", description: "Carry an awkward load and let the whole body fight to stabilize." },
  { name: "Kettlebell Complex", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Man-Makers", compound: true, difficulty: "intermediate", description: "Swing, clean, press, squat — chained without setting the weight down." },
  { name: "Push-Up to Row", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Renegade Rows", compound: true, difficulty: "intermediate", description: "Alternate a push-up with a single-arm row from the plank." },
  { name: "Lunge to Curl to Press", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbells", alternative: "Squat to Press", compound: true, difficulty: "intermediate", description: "Chain three movements into one rep for maximum time efficiency." },
  { name: "Get-Up Sit-Up", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Turkish Get-Up", compound: true, difficulty: "intermediate", description: "The first half of a Turkish get-up — press up to the elbow and back." },
  { name: "Plank to Push-Up", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Inchworm", compound: true, difficulty: "beginner", description: "Move from forearms to hands and back without rocking the hips." },
  { name: "Squat Jump to Push-Up", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Burpees", compound: true, difficulty: "intermediate", description: "Pair a lower body explosion with an upper body press each rep." },
  { name: "Overhead Walking Lunge", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "DB/Plate", alternative: "Walking Lunges", compound: true, difficulty: "advanced", description: "Hold the weight locked overhead while lunging — brutal on the core." },
  { name: "Suitcase Carry", bodyPart: "Full Body", location: "Home/Gym", category: "Weighted", equipment: "Dumbbell", alternative: "Farmer's Carry", compound: true, difficulty: "beginner", description: "Load one side only and resist leaning — anti-lateral-flexion work." },
  { name: "Sprawls", bodyPart: "Full Body", location: "Home/Gym", category: "Bodyweight", equipment: "None", alternative: "Burpees", compound: true, difficulty: "intermediate", description: "Drop the hips to the floor and pop back up — a wrestler's conditioning drill." },
];

// All unique body parts for the selector
export const BODY_PARTS = [
  "Chest", "Back", "Biceps", "Triceps", "Shoulders", "Legs", "Abs/Core", "Cardio", "Full Body"
];

// Goal configurations from agents.md
// workSeconds = time under tension for a single set, used by the time budget.
// Cutting pairs movements into supersets — that's what metabolic stress training calls for.
export const GOALS = {
  bulking: {
    label: "Bulking",
    repRange: "8–12",
    restSeconds: 90,
    focus: "Hypertrophy",
    workSeconds: 40,
    supersets: false,
  },
  cutting: {
    label: "Cutting",
    repRange: "12–20",
    restSeconds: 35,
    focus: "Metabolic Stress",
    workSeconds: 45,
    supersets: true,
    supersetTransitionSeconds: 15, // near-zero rest between paired movements
  },
};

// Fitness level configurations.
// setsPerExercise drives density; restMultiplier scales the prescribed rest;
// maxDifficulty gates which movements the level is allowed to be given.
export const FITNESS_LEVELS = {
  beginner: {
    label: "Beginner",
    setsPerExercise: 3,
    restMultiplier: 1.2,
    maxDifficulty: "beginner",
    description: "3 sets · longer rest · foundational movements",
  },
  intermediate: {
    label: "Intermediate",
    setsPerExercise: 4,
    restMultiplier: 1.0,
    maxDifficulty: "intermediate",
    description: "4 sets · standard rest · full barbell work",
  },
  advanced: {
    label: "Advanced",
    setsPerExercise: 4,
    restMultiplier: 0.85,
    maxDifficulty: "advanced",
    description: "4–5 sets · short rest · every movement unlocked",
  },
};

// Ordering used to compare an exercise's difficulty against a fitness level.
export const DIFFICULTY_RANK = { beginner: 1, intermediate: 2, advanced: 3 };

// Below this many candidates the difficulty gate is relaxed rather than
// handing back an empty or repetitive workout.
export const MIN_POOL_SIZE = 4;

// Seconds spent walking to the next station and setting up.
export const TRANSITION_SECONDS = 30;

// Sets are never pushed past this when back-filling a leftover time budget.
export const MAX_SETS_PER_EXERCISE = 5;

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
