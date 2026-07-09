// Explorer.jsx — Animated pirate character that walks along the path
import { motion } from "framer-motion";

/**
 * Explorer — floats above its current node position.
 * Position is updated by the Map parent when a day is clicked.
 * @param {object} position - { x: number (%), y: number (%) } relative to map
 */
const Explorer = ({ position, isMoving }) => {
  if (!position) return null;

  return (
    <motion.div
      className="explorer-char"
      animate={{
        left: `${position.x}%`,
        top:  `${position.y}%`,
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 18,
        mass: 1.2,
      }}
      style={{
        position: "absolute",
        zIndex: 20,
        transform: "translate(-50%, -110%)",
        pointerEvents: "none",
      }}
    >
      {/* Character + walking animation */}
      <motion.div
        animate={
          isMoving
            ? { y: [0, -4, 0, -4, 0], rotate: [0, -5, 0, 5, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          isMoving
            ? { duration: 0.4, repeat: Infinity }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
        className="text-3xl md:text-4xl select-none"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}
      >
        🧭
      </motion.div>

      {/* Speech bubble when moving */}
      {isMoving && (
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-amber-900 whitespace-nowrap"
          initial={{ opacity: 0, scale: 0.5, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
        >
          Sailing! ⛵
        </motion.div>
      )}

      {/* Glow beneath character */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(212,160,23,0.5) 0%, transparent 70%)" }}
        animate={{ scaleX: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default Explorer;
