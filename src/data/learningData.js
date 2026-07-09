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
    location: "The Pirate Ship",
    locationType: "ship",
    timeSpent: "2h 30m",
    difficulty: 2,
    completed: true,
    topics: ["React fundamentals", "JSX syntax", "Component basics"],
    notes: "Began the journey! Set up the development environment and wrote my first React components. Excited to see where this goes.",
    badge: "Pioneer",
    streak: 1,
  },
  // ─────────────────────────────────────────────
  // DAY 2
  // ─────────────────────────────────────────────
  {
    day: 2,
    title: "First Landfall",
    location: "Palm Tree Cove",
    locationType: "palm",
    timeSpent: "3h",
    difficulty: 2,
    completed: true,
    topics: ["Props & State", "useState hook", "Event handling"],
    notes: "Discovered how React state works. Props passing between components finally clicked today.",
    badge: "Explorer",
    streak: 2,
  },
  // ─────────────────────────────────────────────
  // DAY 3
  // ─────────────────────────────────────────────
  {
    day: 3,
    title: "Base Camp",
    location: "Explorer's Camp",
    locationType: "camp",
    timeSpent: "2h",
    difficulty: 3,
    completed: true,
    topics: ["useEffect hook", "Component lifecycle", "Side effects"],
    notes: "Understanding the lifecycle was tricky at first. The cleanup function in useEffect is really important!",
    badge: "Scout",
    streak: 3,
  },
  // ─────────────────────────────────────────────
  // DAY 4
  // ─────────────────────────────────────────────
  {
    day: 4,
    title: "Into the Dark",
    location: "Mystic Cave",
    locationType: "cave",
    timeSpent: "4h",
    difficulty: 4,
    completed: false,
    topics: ["Context API", "useContext", "Global state management"],
    notes: "",
    badge: "",
    streak: 0,
  },
  // ─────────────────────────────────────────────
  // DAY 5
  // ─────────────────────────────────────────────
  {
    day: 5,
    title: "The Climb",
    location: "Dragon Peak",
    locationType: "mountain",
    timeSpent: "",
    difficulty: 0,
    completed: false,
    topics: ["React Router", "Navigation", "URL params", "Nested routes"],
    notes: "",
    badge: "",
    streak: 0,
  },
  // ─────────────────────────────────────────────
  // DAY 6
  // ─────────────────────────────────────────────
  {
    day: 6,
    title: "Hidden Falls",
    location: "Crystal Waterfall",
    locationType: "waterfall",
    timeSpent: "",
    difficulty: 0,
    completed: false,
    topics: ["Custom hooks", "Code reuse", "useLocalStorage", "useFetch"],
    notes: "",
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
    topics: ["Project showcase", "Reflections", "Next goals"],
    notes: "The end of the week — but the beginning of a great journey!",
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
