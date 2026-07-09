// utils/nodeConfig.js — Icon and color mapping for each location type

/* ── Icon map: locationType → { emoji, label } ── */
export const NODE_ICONS = {
  ship:       { emoji: "⛵", label: "Ship" },
  palm:       { emoji: "🌴", label: "Palm Tree" },
  camp:       { emoji: "⛺", label: "Camp" },
  cave:       { emoji: "🕳", label: "Cave" },
  mountain:   { emoji: "⛰", label: "Mountain" },
  waterfall:  { emoji: "💧", label: "Waterfall" },
  dock:       { emoji: "⚓", label: "Dock" },
  lighthouse: { emoji: "🗼", label: "Lighthouse" },
  bridge:     { emoji: "🌉", label: "Bridge" },
  ruins:      { emoji: "🏛", label: "Ruins" },
  volcano:    { emoji: "🌋", label: "Volcano" },
  jungle:     { emoji: "🌿", label: "Jungle" },
  beach:      { emoji: "🏖", label: "Beach" },
  fortress:   { emoji: "🏰", label: "Fortress" },
  lagoon:     { emoji: "🏞", label: "Lagoon" },
  market:     { emoji: "🏪", label: "Market" },
  temple:     { emoji: "🛕", label: "Temple" },
  canyon:     { emoji: "🪨", label: "Canyon" },
  oasis:      { emoji: "🌊", label: "Oasis" },
  glacier:    { emoji: "🏔", label: "Glacier" },
  reef:       { emoji: "🐠", label: "Reef" },
  cliff:      { emoji: "🦅", label: "Cliff" },
  harbor:     { emoji: "🚢", label: "Harbor" },
  swamp:      { emoji: "🌫", label: "Swamp" },
  meadow:     { emoji: "🌾", label: "Meadow" },
  desert:     { emoji: "🏜", label: "Desert" },
  forest:     { emoji: "🌲", label: "Forest" },
  tower:      { emoji: "🗺", label: "Tower" },
  treasure:   { emoji: "💰", label: "Treasure" },
  default:    { emoji: "📍", label: "Location" },
};

export const getNodeIcon = (locationType) =>
  NODE_ICONS[locationType] || NODE_ICONS.default;

/* ── Color map: status → tailwind / CSS values ── */
export const getNodeColors = (status) => {
  switch (status) {
    case "completed":
      return {
        bg:          "bg-amber-100 dark:bg-amber-900/60",
        border:      "border-amber-500",
        borderColor: "#D4A017",
        text:        "text-amber-800 dark:text-amber-200",
        shadow:      "0 0 12px rgba(212,160,23,0.6), 0 4px 12px rgba(0,0,0,0.3)",
      };
    case "current":
      return {
        bg:          "bg-blue-100 dark:bg-blue-900/60",
        border:      "border-blue-500",
        borderColor: "#1a8fc7",
        text:        "text-blue-800 dark:text-blue-200",
        shadow:      "0 0 14px rgba(26,143,199,0.7), 0 4px 12px rgba(0,0,0,0.3)",
      };
    default: // future
      return {
        bg:          "bg-stone-200 dark:bg-stone-700/50",
        border:      "border-stone-400",
        borderColor: "#9ca3af",
        text:        "text-stone-500 dark:text-stone-400",
        shadow:      "0 2px 8px rgba(0,0,0,0.2)",
      };
  }
};
