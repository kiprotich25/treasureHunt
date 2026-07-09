// LearningModal.jsx — Beautifully styled modal for day details
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { FiX, FiClock, FiAward } from "react-icons/fi";
import { GiSwordClash, GiTreasureMap } from "react-icons/gi";
import { getNodeIcon } from "../utils/nodeConfig";

/* ── Difficulty star renderer ── */
const DifficultyStars = ({ level }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`text-lg ${i <= level ? "star-filled" : "star-empty"}`}>★</span>
    ))}
  </div>
);

/* ── Badge pill ── */
const BadgePill = ({ badge }) => {
  if (!badge) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-glow bg-amber-500/20 border border-amber-500/50 text-amber-800 dark:text-amber-300">
      <FiAward className="text-amber-600" />
      <span className="font-adventure text-xs font-semibold">{badge}</span>
    </div>
  );
};

/* ── Backdrop variants ── */
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

/* ── Modal card variants ── */
const modalVariants = {
  hidden:  { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.25 },
  },
};

const LearningModal = ({ day, onClose }) => {
  const { emoji } = getNodeIcon(day?.locationType);

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!day) return null;

  const isCompleted = day.completed;
  const isTreasure  = day.locationType === "treasure";

  return (
    <AnimatePresence>
      {/* ── Backdrop ── */}
      {/* ✏️ EDITED: p-0 on mobile so modal goes full-screen; p-4 on sm+ */}
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 modal-backdrop"
        style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        {/* ── Modal Card ── */}
        <motion.div
          className="modal-card relative w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 md:p-8 pb-8"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✏️ EDITED: larger touch area on mobile (p-3 on sm:p-2) */}
          <motion.button
            onClick={onClose}
            className="absolute top-3 right-3 p-3 sm:p-2 rounded-full bg-amber-800/20 border border-amber-700/30 text-amber-800 dark:text-amber-300 hover:bg-amber-800/40 transition-colors z-10"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="text-xl" />
          </motion.button>

          {/* ── Header ── */}
          <div className="flex items-start gap-4 mb-6">
            {/* Icon circle */}
            <motion.div
              className={`
                flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2
                ${isCompleted
                  ? "bg-amber-100 border-amber-500 shadow-glow-gold"
                  : "bg-stone-100 border-stone-400 dark:bg-stone-800 dark:border-stone-600"}
              `}
              animate={isCompleted ? { boxShadow: ["0 0 10px rgba(212,160,23,0.4)", "0 0 20px rgba(212,160,23,0.8)", "0 0 10px rgba(212,160,23,0.4)"] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {emoji}
            </motion.div>

            <div className="flex-1">
              {/* Day label */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-adventure text-xs tracking-widest text-amber-700 dark:text-amber-500 uppercase">
                  Day {day.day}
                </span>
                <BadgePill badge={day.badge} />
              </div>

              {/* Title */}
              <h2 className="font-pirate text-2xl md:text-3xl text-amber-900 dark:text-amber-200 leading-tight">
                {day.title}
              </h2>

              {/* Location */}
              <div className="flex items-center gap-1.5 mt-1">
                <GiTreasureMap className="text-amber-600 text-sm" />
                <span className="text-sm text-amber-700 dark:text-amber-500 font-adventure">
                  {day.location}
                </span>
              </div>
            </div>
          </div>

          {/* ── Status Banner ── */}
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-lg mb-6 text-sm font-semibold font-adventure
            ${isCompleted
              ? "bg-green-100 dark:bg-green-900/30 border border-green-400/50 text-green-700 dark:text-green-400"
              : "bg-stone-100 dark:bg-stone-800/50 border border-stone-400/50 text-stone-500 dark:text-stone-400"}
          `}>
            {isCompleted ? "⚔ Quest Completed!" : "🔒 Quest Locked — Keep Adventuring!"}
          </div>

          {/* ── Meta Row ── */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Time Spent */}
            <div className="bg-amber-50/80 dark:bg-amber-950/40 rounded-xl p-3 border border-amber-200/50 dark:border-amber-800/40">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-500 mb-1">
                <FiClock className="text-sm" />
                <span className="text-xs font-adventure font-semibold uppercase tracking-wide">Time Spent</span>
              </div>
              <p className="text-amber-900 dark:text-amber-200 font-bold">
                {day.timeSpent || "—"}
              </p>
            </div>

            {/* Difficulty */}
            <div className="bg-amber-50/80 dark:bg-amber-950/40 rounded-xl p-3 border border-amber-200/50 dark:border-amber-800/40">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-500 mb-1">
                <GiSwordClash className="text-sm" />
                <span className="text-xs font-adventure font-semibold uppercase tracking-wide">Difficulty</span>
              </div>
              {day.difficulty > 0
                ? <DifficultyStars level={day.difficulty} />
                : <p className="text-amber-400">—</p>}
            </div>
          </div>

          {/* ── Topics ── */}
          {day.topics?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-adventure text-sm font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                📜 Topics Learned
              </h3>
              <ul className="space-y-2">
                {day.topics.map((topic, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-amber-900 dark:text-amber-200"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <span className="text-amber-500 mt-0.5 text-xs">⚜</span>
                    {topic}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Notes ── */}
          {day.notes && (
            <div className="mb-6">
              <h3 className="font-adventure text-sm font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wide mb-3">
                🗺 Captain's Notes
              </h3>
              <p className="text-sm text-amber-900/80 dark:text-amber-300/80 leading-relaxed italic bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/40 dark:border-amber-800/30">
                "{day.notes}"
              </p>
            </div>
          )}

          {/* ── Treasure special message ── */}
          {isTreasure && isCompleted && (
            <motion.div
              className="bg-gradient-to-r from-amber-400/30 to-yellow-400/30 border-2 border-amber-500/60 rounded-xl p-4 text-center"
              animate={{ boxShadow: ["0 0 10px rgba(212,160,23,0.4)", "0 0 30px rgba(212,160,23,0.8)", "0 0 10px rgba(212,160,23,0.4)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="font-pirate text-2xl text-amber-800 dark:text-amber-300">⚓ Legend of the Sea! ⚓</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">You completed the entire month! The treasure is yours!</p>
            </motion.div>
          )}

          {/* ── Close hint ── */}
          <p className="text-center text-xs text-amber-700/40 dark:text-amber-600/40 mt-6 font-adventure">
            Press ESC or click outside to close
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LearningModal;
