// Map.jsx — The full pirate treasure map with snaking path, nodes, and decorations
// ✏️  EDITED: Path layout updated for 7 nodes (was 30)
// ✏️  EDITED: Map height is now fully responsive (clamp removed, uses aspect-ratio on mobile)
import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DayNode from "./DayNode";
import Explorer from "./Explorer";
import { currentDayIndex } from "../data/learningData";
import { useAdventureAudio } from "../context/AudioContext";

/* ============================================================
   PATH LAYOUT — 7 nodes in a snake pattern
   ✏️  CHANGED: was 6 rows × 5 cols (30 nodes)
                now 2 rows × 4 cols, but last row has 3 nodes
   Positions are percentages [x%, y%] of the map container.
   ============================================================ */
const generatePath = () => {
  // 7 hard-coded positions that snake nicely across the map
  // Row 1 (L→R): days 1-4   at y ≈ 30%
  // Row 2 (R→L): days 5-7   at y ≈ 70%
  return [
    { x: 10,  y: 28 },  // Day 1 — Ship
    { x: 33,  y: 22 },  // Day 2 — Palm
    { x: 56,  y: 30 },  // Day 3 — Camp
    { x: 80,  y: 24 },  // Day 4 — Cave
    { x: 78,  y: 68 },  // Day 5 — Mountain (turns down)
    { x: 50,  y: 74 },  // Day 6 — Waterfall
    { x: 20,  y: 70 },  // Day 7 — Treasure
  ];
};

export const NODE_POSITIONS = generatePath();

/* Build SVG path string connecting all positions */
const buildSVGPath = (positions) => {
  if (positions.length === 0) return "";
  const pts = positions.map(({ x, y }) => `${x},${y}`);
  return "M " + pts.join(" L ");
};

/* ── Decorative map elements ── */
const MapDecorations = () => (
  <>
    {/* Ocean blobs */}
    <div className="ocean-blob absolute w-40 h-28 top-[10%] left-[1%] opacity-50" />
    <div
      className="ocean-blob absolute w-56 h-36 bottom-[8%] right-[3%] opacity-45"
      style={{ animationDelay: "-3s", animationDuration: "11s" }}
    />

    {/* Islands */}
    {[
      { top: "8%",  left: "2%",   size: "text-3xl md:text-4xl", emoji: "🏝", delay: "0s"  },
      { top: "72%", right: "2%",  size: "text-2xl md:text-3xl", emoji: "🏝", delay: "-2s" },
      { top: "42%", left: "0.5%", size: "text-xl  md:text-2xl", emoji: "🏔", delay: "-4s" },
      { top: "15%", right: "1%",  size: "text-2xl md:text-3xl", emoji: "⛰", delay: "-1s" },
    ].map((item, i) => (
      <motion.div
        key={i}
        className={`absolute select-none ${item.size}`}
        style={{ top: item.top, left: item.left, right: item.right }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, delay: parseFloat(item.delay), repeat: Infinity, ease: "easeInOut" }}
      >
        {item.emoji}
      </motion.div>
    ))}

    {/* Pirate ship decoration */}
    <motion.div
      className="absolute bottom-[12%] left-[5%] text-3xl md:text-4xl select-none"
      animate={{ x: [0, 8, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      title="The Pirate Ship"
    >
      🏴‍☠️
    </motion.div>

    {/* Compass rose */}
    <motion.div
      className="absolute top-[2%] right-[3%] text-3xl md:text-5xl select-none opacity-70"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      🧭
    </motion.div>

    {/* Palm trees */}
    {[
      { top: "28%", left: "3%",  size: "text-2xl md:text-3xl" },
      { top: "58%", right: "3%", size: "text-xl  md:text-2xl" },
      { top: "6%",  left: "44%", size: "text-xl  md:text-2xl" },
    ].map((item, i) => (
      <motion.div
        key={i}
        className={`absolute select-none ${item.size}`}
        style={{ top: item.top, left: item.left, right: item.right }}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
      >
        🌴
      </motion.div>
    ))}

    {/* Rocks */}
    {[
      { bottom: "22%", left: "28%",  size: "text-xl md:text-2xl" },
      { top: "48%",    right: "18%", size: "text-lg md:text-xl"  },
      { top: "68%",    left: "14%",  size: "text-base md:text-lg"},
    ].map((item, i) => (
      <div
        key={i}
        className={`absolute select-none ${item.size} opacity-60`}
        style={item}
      >
        🪨
      </div>
    ))}

    {/* Cave */}
    <div className="absolute top-[48%] right-[6%] text-2xl md:text-3xl select-none opacity-70">🕳</div>

    {/* Map border ornaments */}
    <div className="absolute top-1.5 left-1.5 text-base md:text-xl text-amber-700/40 select-none">⚜</div>
    <div className="absolute top-1.5 right-1.5 text-base md:text-xl text-amber-700/40 select-none">⚜</div>
    <div className="absolute bottom-1.5 left-1.5 text-base md:text-xl text-amber-700/40 select-none">⚜</div>
    <div className="absolute bottom-1.5 right-1.5 text-base md:text-xl text-amber-700/40 select-none">⚜</div>

    {/* Flavour text */}
    <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 font-adventure text-[9px] md:text-[10px] tracking-widest text-amber-700/30 select-none uppercase whitespace-nowrap">
      ⚔ Here Be Dragons ⚔
    </div>
  </>
);

/* ── Floating Clouds ── */
const FloatingClouds = () => {
  const clouds = [
    { top: "5%",  duration: 40, size: "text-2xl md:text-3xl", delay: 0   },
    { top: "14%", duration: 55, size: "text-3xl md:text-4xl", delay: -15 },
    { top: "3%",  duration: 35, size: "text-xl  md:text-2xl", delay: -8  },
  ];
  return (
    <>
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className={`cloud ${c.size}`}
          style={{ top: c.top }}
          initial={{ x: -120 }}
          animate={{ x: "110vw" }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "linear" }}
        >
          ☁
        </motion.div>
      ))}
    </>
  );
};

/* ── Flying Birds ── */
const FlyingBirds = () => {
  const birds = [
    { top: "7%",  duration: 20, delay: 0,   size: "text-xs md:text-sm" },
    { top: "18%", duration: 28, delay: -10, size: "text-xs"             },
  ];
  return (
    <>
      {birds.map((b, i) => (
        <motion.div
          key={i}
          className={`bird ${b.size}`}
          style={{ top: b.top }}
          initial={{ x: -60 }}
          animate={{ x: "110vw", y: [0, -15, 5, -10, 0] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
            y: { duration: 4, repeat: Infinity },
          }}
        >
          🕊
        </motion.div>
      ))}
    </>
  );
};

/* ── Sparkle effects on completed nodes ── */
const Sparkles = ({ positions, completedIndices }) => (
  <>
    {completedIndices.map((idx) => {
      const pos = positions[idx];
      if (!pos) return null;
      return [0, 1, 2].map((j) => (
        <motion.div
          key={`spark-${idx}-${j}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400 pointer-events-none"
          style={{
            left:   `${pos.x + (j - 1) * 3}%`,
            top:    `${pos.y - 5}%`,
            zIndex: 5,
          }}
          animate={{ opacity: [0, 1, 0], y: [0, -10, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, delay: j * 0.4 + idx * 0.1, repeat: Infinity }}
        />
      ));
    })}
  </>
);

/* ============================================================
   MAP — Main Component
   ✏️  EDITED: responsive height (was fixed clamp 600-900px)
               now uses a percentage-based aspect-ratio approach
   ============================================================ */
const Map = ({ data, filter, searchQuery, onNodeClick }) => {
  const mapRef = useRef(null);
  const [explorerPos, setExplorerPos] = useState(null);
  const [isMoving, setIsMoving]       = useState(false);

  /* ── Audio hook — lets Map trigger the adventure soundtrack ── */
  const { startAdventureMusic } = useAdventureAudio();

  /* Set explorer to default position on mount */
  useEffect(() => {
    const defaultIdx = Math.min(currentDayIndex, NODE_POSITIONS.length - 1);
    setExplorerPos(NODE_POSITIONS[defaultIdx]);
  }, []);

  /* Handle node click */
  const handleNodeClick = useCallback((day, index) => {
    setIsMoving(true);
    setExplorerPos(NODE_POSITIONS[index]);
    setTimeout(() => setIsMoving(false), 1200);

    // ◀ MUSIC STARTS HERE — only fires on the very first Day 1 click ▶
    // index 0 = Day 1 (the first node on the map).
    // startAdventureMusic() is guarded inside AudioContext: subsequent calls
    // from any day click (including Day 1 again) are silently ignored.
    if (index === 0) {
      startAdventureMusic();
    }

    onNodeClick(day);
  }, [onNodeClick, startAdventureMusic]);

  const svgPath = buildSVGPath(NODE_POSITIONS);

  /* Determine node status */
  const getStatus = (index) => {
    if (data[index]?.completed) return "completed";
    if (index === currentDayIndex) return "current";
    return "future";
  };

  /* Filter/search visibility */
  const isNodeVisible = (day) => {
    if (filter === "completed"  && !day.completed) return false;
    if (filter === "incomplete" &&  day.completed) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle  = day.title.toLowerCase().includes(q);
      const inTopics = day.topics?.some((t) => t.toLowerCase().includes(q));
      const inNotes  = day.notes?.toLowerCase().includes(q);
      if (!inTitle && !inTopics && !inNotes) return false;
    }
    return true;
  };

  const completedIndices = data
    .map((d, i) => (d.completed ? i : null))
    .filter((i) => i !== null);

  return (
    /* ✏️  RESPONSIVE: padding-top % gives a natural aspect ratio on all screens.
           On mobile  → 70vw tall (portrait friendly)
           On tablet  → 60vw
           On desktop → fixed min/max via the outer wrapper               */
    <div
      ref={mapRef}
      className="map-area relative w-full select-none"
      style={{
        /* aspect-ratio trick: height = 55% of width, min 300px, max 700px */
        paddingTop: "clamp(300px, 55%, 700px)",
      }}
    >
      {/* Inner absolute layer — fills the padded box */}
      <div className="absolute inset-0">
        {/* ── Background decorations ── */}
        <MapDecorations />
        <FloatingClouds />
        <FlyingBirds />

        {/* ── SVG Dotted Path ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 2 }}
        >
          {/* Drop shadow path */}
          <path
            d={svgPath}
            fill="none"
            stroke="rgba(92,46,0,0.3)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0.3, 0.4)"
          />

          {/* Gold completed segment */}
          {currentDayIndex > 0 && (
            <path
              d={buildSVGPath(NODE_POSITIONS.slice(0, currentDayIndex + 1))}
              fill="none"
              stroke="rgba(212,160,23,0.9)"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.8 1.4"
            />
          )}

          {/* Brown dashes — full path */}
          <motion.path
            d={svgPath}
            fill="none"
            stroke="rgba(139,69,19,0.55)"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1.5 1.5"
            className="treasure-path"
          />

          {/* Connector dots at each node */}
          {NODE_POSITIONS.map((pos, i) => (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r="0.6"
              fill={
                getStatus(i) === "completed"
                  ? "rgba(212,160,23,0.8)"
                  : "rgba(139,69,19,0.4)"
              }
            />
          ))}
        </svg>

        {/* ── Sparkles ── */}
        <Sparkles positions={NODE_POSITIONS} completedIndices={completedIndices} />

        {/* ── Day Nodes ── */}
        {data.map((day, index) => (
          <div
            key={day.day}
            style={{
              position: "absolute",
              left:     `${NODE_POSITIONS[index]?.x ?? 0}%`,
              top:      `${NODE_POSITIONS[index]?.y ?? 0}%`,
              zIndex:   10,
            }}
          >
            <DayNode
              day={day}
              status={getStatus(index)}
              onClick={() => handleNodeClick(day, index)}
              isFiltered={isNodeVisible(day)}
            />
          </div>
        ))}

        {/* ── Explorer Character ── */}
        <Explorer position={explorerPos} isMoving={isMoving} />

        {/* ── Dim overlay when filter/search active ── */}
        {(filter !== "all" || searchQuery) && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ background: "rgba(0,0,0,0.08)", zIndex: 8 }}
          />
        )}
      </div>
    </div>
  );
};

export default Map;
