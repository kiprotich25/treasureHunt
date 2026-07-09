// Map.jsx — The full pirate treasure map with snaking path, nodes, and decorations
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DayNode from "./DayNode";
import Explorer from "./Explorer";
import { currentDayIndex } from "../data/learningData";

/* ============================================================
   PATH LAYOUT — 30 nodes in a snake pattern across 6 rows
   Positions are percentages [x%, y%] of the map container.
   Row alternates L→R and R→L for snake effect.
   ============================================================ */
const generatePath = () => {
  const positions = [];

  // 6 rows × 5 columns = 30 nodes
  const rows = 6;
  const cols = 5;
  const xStart = 8;
  const xEnd   = 92;
  const yStart = 8;
  const yEnd   = 92;

  const xStep = (xEnd - xStart) / (cols - 1);
  const yStep = (yEnd - yStart) / (rows - 1);

  // Slight organic jitter for each node position
  const jitter = [
     [0, 0],
     [2, -3], [-1, 2], [3, -1], [-2, 3],
    [0, 0], [-2, 2], [1, -2], [-3, 1], [2, -3],
    [0, 0], [3, 2],  [-2, -1],[1, 3],  [-1, -2],
    [0, 0], [-3, -2],[2, 1],  [-1, -3],[3, 2],
    [0, 0], [2, -2], [-3, 1], [1, -1], [-2, 3],
    [0, -2], [3, 1],  [-1, -2],[2, 2],  [-2, -4],
  ];

  for (let row = 0; row < rows; row++) {
    const y = yStart + row * yStep;
    const leftToRight = row % 2 === 0;

    for (let col = 0; col < cols; col++) {
      const xCol = leftToRight ? col : (cols - 1 - col);
      const x = xStart + xCol * xStep;
      const idx = row * cols + col;
      const [jx, jy] = jitter[idx] || [0, 0];
      positions.push({ x: x + jx, y: y + jy });
    }
  }

  return positions;
};

export const NODE_POSITIONS = generatePath();

/* Build SVG path string from node positions */
const buildSVGPath = (positions) => {
  if (positions.length === 0) return "";
  const pts = positions.map(({ x, y }) => `${x},${y}`);
  return "M " + pts.join(" L ");
};

/* ── Decorative map elements ── */
const MapDecorations = () => (
  <>
    {/* Ocean blobs */}
    <div className="ocean-blob absolute w-48 h-32 top-[15%] left-[2%] opacity-60" />
    <div className="ocean-blob absolute w-64 h-40 bottom-[10%] right-[5%] opacity-50"
      style={{ animationDelay: "-3s", animationDuration: "11s" }} />
    <div className="ocean-blob absolute w-40 h-28 top-[55%] left-[60%] opacity-40"
      style={{ animationDelay: "-5s", animationDuration: "9s" }} />

    {/* Islands */}
    {[
      { top: "12%", left: "3%",  size: "text-4xl", emoji: "🏝", delay: "0s" },
      { top: "75%", right: "3%", size: "text-3xl", emoji: "🏝", delay: "-2s" },
      { top: "40%", left: "1%",  size: "text-2xl", emoji: "🏔", delay: "-4s" },
      { top: "20%", right: "2%", size: "text-3xl", emoji: "⛰", delay: "-1s" },
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
      className="absolute bottom-[8%] left-[8%] text-4xl select-none"
      animate={{ x: [0, 8, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      title="The Pirate Ship"
    >
      🏴‍☠️
    </motion.div>

    {/* Compass rose */}
    <motion.div
      className="absolute top-[2%] right-[4%] text-5xl select-none opacity-70"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      🧭
    </motion.div>

    {/* Palm trees */}
    {[
      { top: "30%", left: "4%",  size: "text-3xl" },
      { top: "60%", right: "4%", size: "text-2xl" },
      { top: "8%",  left: "45%", size: "text-2xl" },
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
      { bottom: "20%", left: "30%",  size: "text-2xl" },
      { top: "45%",    right: "20%", size: "text-xl" },
      { top: "70%",    left: "15%",  size: "text-lg" },
    ].map((item, i) => (
      <div
        key={i}
        className={`absolute select-none ${item.size} opacity-60`}
        style={item}
      >
        🪨
      </div>
    ))}

    {/* Cave decoration */}
    <div className="absolute top-[50%] right-[8%] text-3xl select-none opacity-70">🕳</div>

    {/* Map border ornaments */}
    <div className="absolute top-2 left-2 text-xl text-amber-700/40 select-none">⚜</div>
    <div className="absolute top-2 right-2 text-xl text-amber-700/40 select-none">⚜</div>
    <div className="absolute bottom-2 left-2 text-xl text-amber-700/40 select-none">⚜</div>
    <div className="absolute bottom-2 right-2 text-xl text-amber-700/40 select-none">⚜</div>

    {/* "HERE BE DRAGONS" text */}
    <div className="absolute bottom-[19%] left-1/2 -translate-x-1/2 font-adventure text-[10px] tracking-widest text-amber-700/30 select-none uppercase whitespace-nowrap">
      ⚔ Here Be Dragons ⚔
    </div>
  </>
);

/* ── Floating Clouds ── */
const FloatingClouds = () => {
  const clouds = [
    { top: "5%",  duration: 40, size: "text-3xl", delay: 0  },
    { top: "15%", duration: 55, size: "text-4xl", delay: -15 },
    { top: "3%",  duration: 35, size: "text-2xl", delay: -8  },
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
    { top: "8%",  duration: 20, delay: 0,   size: "text-sm" },
    { top: "20%", duration: 28, delay: -10, size: "text-xs" },
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
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear", y: { duration: 4, repeat: Infinity } }}
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
            left:  `${pos.x + (j - 1) * 3}%`,
            top:   `${pos.y - 4}%`,
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
   ============================================================ */
const Map = ({ data, filter, searchQuery, onNodeClick }) => {
  const mapRef = useRef(null);
  const [explorerPos, setExplorerPos] = useState(null);
  const [isMoving, setIsMoving]       = useState(false);
  const [mapSize, setMapSize]         = useState({ w: 800, h: 600 });

  /* Track map dimensions for SVG viewport */
  useEffect(() => {
    const measure = () => {
      if (mapRef.current) {
        setMapSize({
          w: mapRef.current.offsetWidth,
          h: mapRef.current.offsetHeight,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Set explorer to default position (current day) on mount */
  useEffect(() => {
    const defaultIdx = Math.min(currentDayIndex, NODE_POSITIONS.length - 1);
    setExplorerPos(NODE_POSITIONS[defaultIdx]);
  }, []);

  /* Handle node click: move explorer + open modal */
  const handleNodeClick = useCallback((day, index) => {
    setIsMoving(true);
    setExplorerPos(NODE_POSITIONS[index]);
    setTimeout(() => setIsMoving(false), 1200);
    onNodeClick(day);
  }, [onNodeClick]);

  /* Build SVG path from all positions */
  const svgPath = buildSVGPath(NODE_POSITIONS);

  /* Determine status for each day */
  const getStatus = (index) => {
    if (data[index]?.completed) return "completed";
    if (index === currentDayIndex)  return "current";
    return "future";
  };

  /* Filter visibility */
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
    <div
      ref={mapRef}
      className="map-area relative w-full overflow-hidden select-none"
      style={{ minHeight: "600px", height: "clamp(600px, 75vh, 900px)" }}
    >
      {/* ── Background decorations ── */}
      <MapDecorations />
      <FloatingClouds />
      <FlyingBirds />

      {/* ── SVG Dotted Path ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 100 100`}
        preserveAspectRatio="none"
        style={{ zIndex: 2 }}
      >
        {/* Shadow path */}
        <path
          d={svgPath}
          fill="none"
          stroke="rgba(92,46,0,0.3)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0.3, 0.3)"
        />

        {/* Completed segment (gold) */}
        {currentDayIndex > 0 && (
          <path
            d={buildSVGPath(NODE_POSITIONS.slice(0, currentDayIndex + 1))}
            fill="none"
            stroke="rgba(212,160,23,0.85)"
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1.5 1.2"
          />
        )}

        {/* Full path (brown dashes) */}
        <motion.path
          d={svgPath}
          fill="none"
          stroke="rgba(139,69,19,0.55)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1.5 1.5"
          className="treasure-path"
        />

        {/* Node connector dots */}
        {NODE_POSITIONS.map((pos, i) => (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r="0.5"
            fill={getStatus(i) === "completed" ? "rgba(212,160,23,0.7)" : "rgba(139,69,19,0.4)"}
          />
        ))}
      </svg>

      {/* ── Sparkle overlays for completed nodes ── */}
      <Sparkles positions={NODE_POSITIONS} completedIndices={completedIndices} />

      {/* ── Day Nodes ── */}
      {data.map((day, index) => (
        <div
          key={day.day}
          style={{
            position: "absolute",
            left: `${NODE_POSITIONS[index]?.x || 0}%`,
            top:  `${NODE_POSITIONS[index]?.y || 0}%`,
            zIndex: 10,
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

      {/* ── Dim overlay when filter active ── */}
      {(filter !== "all" || searchQuery) && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.08)", zIndex: 8 }}
        />
      )}
    </div>
  );
};

export default Map;
