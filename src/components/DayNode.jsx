// DayNode.jsx — Individual day stop on the treasure map
import { motion } from "framer-motion";
import { getNodeIcon, getNodeColors } from "../utils/nodeConfig";

/**
 * DayNode — renders a single day stop with icon, label and status glow.
 * @param {object} day        - learningData entry
 * @param {string} status     - "completed" | "current" | "future"
 * @param {function} onClick  - callback when node is clicked
 * @param {boolean} isFiltered - whether this node passes the active filter
 */
const DayNode = ({ day, status, onClick, isFiltered }) => {
  const { emoji, label } = getNodeIcon(day.locationType);
  const colors = getNodeColors(status);

  const isTreasure = day.locationType === "treasure";

  if (!isFiltered) return null;

  return (
    <motion.div
      className="day-node flex flex-col items-center cursor-pointer select-none"
      onClick={() => onClick(day)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: day.day * 0.04 }}
      whileHover={
        status !== "future"
          ? {
              scale: 1.2,
              y: -6,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }
          : { scale: 1.1 }
      }
      whileTap={{ scale: 0.95 }}
    >
      {/* ── Node Circle ── */}
      <div className={`relative ${isTreasure ? "w-16 h-16 md:w-20 md:h-20" : "w-12 h-12 md:w-14 md:h-14"}`}>
        {/* Outer glow ring (completed/current) */}
        {status === "completed" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(212,160,23,0.25)", boxShadow: "0 0 16px rgba(212,160,23,0.6)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}
        {status === "current" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(26,143,199,0.2)", boxShadow: "0 0 20px rgba(26,143,199,0.8)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
        {isTreasure && (
          <motion.div
            className="absolute inset-0 rounded-full treasure-glow"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Main circle */}
        <div
          className={`
            relative w-full h-full rounded-full flex items-center justify-center
            border-3 font-bold text-xl md:text-2xl
            shadow-node transition-all duration-200
            ${colors.bg} ${colors.border} ${colors.text}
          `}
          style={{
            border: `3px solid ${colors.borderColor}`,
            boxShadow: colors.shadow,
          }}
        >
          <span className={`${isTreasure ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"} leading-none`}>
            {isTreasure && status !== "completed" ? "🔒" : emoji}
          </span>
        </div>

        {/* Day number badge */}
        <div
          className={`
            absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6
            rounded-full flex items-center justify-center
            text-xs font-bold font-adventure
            ${status === "completed" ? "bg-amber-500 text-white" : status === "current" ? "bg-blue-500 text-white" : "bg-stone-400 text-white"}
          `}
          style={{ fontSize: "9px" }}
        >
          {day.day}
        </div>
      </div>

      {/* ── Label ── */}
      <div
        className={`
          mt-1.5 px-2 py-0.5 rounded text-center max-w-[80px] md:max-w-[100px]
          ${status === "completed" ? "text-amber-800 dark:text-amber-300" :
            status === "current"   ? "text-blue-700  dark:text-blue-300"   :
                                     "text-stone-500 dark:text-stone-400"}
        `}
      >
        <p className="font-adventure text-[9px] md:text-[10px] font-semibold leading-tight text-center truncate">
          {day.title}
        </p>
      </div>
    </motion.div>
  );
};

export default DayNode;
