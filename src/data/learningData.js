 /////////////////////////////////////////////
// ✏️  EDIT YOUR MONTHLY LEARNING HERE
// This is the ONLY file you need to modify.
// The entire UI will automatically update!
/////////////////////////////////////////////

// Available locationType values:
// "ship" | "palm" | "camp" | "cave" | "mountain" | "waterfall"
// "dock" | "lighthouse" | "bridge" | "ruins" | "volcano" | "jungle"
// "beach" | "fortress" | "lagoon" | "market" | "temple" | "canyon"
// "oasis" | "glacier" | "reef" | "cliff" | "harbor" | "swamp"
// "meadow" | "desert" | "forest" | "tower" | "treasure"

export const learningData = [
  // ─────────────────────────────────────────────
  // DAY 1
  // ─────────────────────────────────────────────
  {
    day: 1,
    title: "Setting Sail",
    location: "The Pirate Ship ~ onSite ",
    locationType: "ship",
    timeSpent: "2h 30m",
    difficulty: 0,
    completed: true,
    topics: ["Scholarship Writing"],
    notes: "The last two paragraphs show my contribution to the community-tying it to broader mission and ties the opportunity as the enabler of my forward vision. Also CV should provide all the evidence",
    badge: "Pioneer",
    streak: 1,
  },
  // ─────────────────────────────────────────────
  // DAY 2
  // ─────────────────────────────────────────────
  {
    day: 2,
    title: "First Landfall",
    location: "Palm Tree Cove ~ onSite ",
    locationType: "palm",
    timeSpent: "3h",
    difficulty: 0,
    completed: true,
    topics: ["Human Centered Design"],
    notes: "When something is hard to use, it's the design's fault, not the user's. What makes something hard or easy to use: Feedback, Affordances, Constraints, Mapping. The design process is iterative and involves prototyping and testing.",
    badge: "Explorer",
    streak: 2,
  },
  // ─────────────────────────────────────────────
  // DAY 3



  // ─────────────────────────────────────────────
  {
    day: 3,
    title: "Base Camp",
    location: "Explorer's Camp ~ onSite ",
    locationType: "camp",
    timeSpent: "2h",
    difficulty: 1,
    completed: true,
    topics: ["Public Speaking"],
    notes: "Have the prop in mind when writing the speech  not at the end. Use first 30 seconds to capture attention from audience through silence, question, surprising fact or story .!",
    badge: "Scout",
    streak: 3,
  },
  // ─────────────────────────────────────────────
  // DAY 4
  // ─────────────────────────────────────────────
  {
    day: 4,
    title: "Into the Dark",
    location: "Mystic Cave ~ virtual",
    locationType: "cave",
    timeSpent: "8h",
    difficulty: 1,
    completed: true,
    topics: ["Cybersecurity Session 5"],
    notes: "Log Monitoring in Cybersecurity. The records of events eg user login attempts, account creation and file access. HaveIbeenPwned is a good tool to check if your email has been compromised.",
    badge: "",
    streak: 0,
  },
  // ─────────────────────────────────────────────
  // DAY 5
  // ─────────────────────────────────────────────
  {
    day: 5,
    title: "The Climb",
    location: "Dragon Peak ~ onSite ",
    locationType: "mountain",
    timeSpent: "",
    difficulty: 0,
    completed: true,
    topics: ["Hackathon day"],
    notes: "Time management is key , more emphasis should be put on most important tasks eg Slides and Demo. Practice more on public speaking for pitching sessions. ",
    badge: "",
    streak: 0,
  },
  // ─────────────────────────────────────────────
  // DAY 6
  // ─────────────────────────────────────────────
  {
    day: 6,
    title: "Hidden Falls",
    location: "Crystal Waterfall ~ virtual",
    locationType: "waterfall",
    timeSpent: "",
    difficulty: 0,
    completed: false,
    topics: ["Monthly Plans"],
    notes: " Complete Penetration Testing path and extra cybersecurity certification. Practice essay writing and public speaking",
    badge: "",
    streak: 0,
  },
  // ─────────────────────────────────────────────
  // DAY 7 — FINAL TREASURE (always keep locationType: "treasure" on the last day)
  // ─────────────────────────────────────────────
  {
    day: 7,
    title: "The Grand Treasure",
    location: "Treasure Island",
    locationType: "treasure",
    timeSpent: "",
    difficulty: 0,
    completed: true,
    topics: ["Project showcase"],
    notes: "The end of the month — but the beginning of a great journey!",
    badge: "Legend",
    streak: 0,
  },
];

/////////////////////////////////////////////
// END OF EDITABLE SECTION
// Do not modify anything below this line
/////////////////////////////////////////////

// Derived data — auto-calculated from learningData above
export const totalDays          = learningData.length;
export const completedDays      = learningData.filter((d) => d.completed).length;
export const currentDayIndex    = completedDays < totalDays ? completedDays : totalDays - 1;
export const completionPercentage = Math.round((completedDays / totalDays) * 100);
export const streakCount        = learningData
  .filter((d) => d.completed)
  .reduce((max, d) => Math.max(max, d.streak || 0), 0);
