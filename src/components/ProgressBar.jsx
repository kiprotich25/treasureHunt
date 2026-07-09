// ProgressBar.jsx — Animated gold progress bar with shimmer
import { motion } from "framer-motion";

const ProgressBar = ({ completed, total }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Label row */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-adventure text-sm text-amber-800 dark:text-amber-400 font-semibold">
          ⚔ Progress
        </span>
        <span className="font-adventure text-sm text-amber-800 dark:text-amber-400">
          <span className="text-amber-600 dark:text-yellow-400 font-bold text-base">{completed}</span>
          <span className="text-amber-700 dark:text-amber-500"> / {total} Days Completed</span>
          <span className="ml-2 text-amber-600 dark:text-yellow-500 font-bold">({pct}%)</span>
        </span>
      </div>

      {/* Track */}
      <div className="h-5 rounded-full progress-track overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.5) 4px, rgba(0,0,0,0.5) 8px)"
          }}
        />

        {/* Fill bar */}
        <motion.div
          className="h-full rounded-full progress-fill relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
        </motion.div>

        {/* Ship marker at current position */}
        {pct > 0 && pct < 100 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 text-lg leading-none select-none"
            animate={{ left: `calc(${pct}% - 12px)` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          >
            ⛵
          </motion.div>
        )}
        {pct === 100 && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-lg leading-none select-none">🏆</div>
        )}
      </div>

      {/* Milestone markers */}
      <div className="relative h-4 mt-1">
        {[25, 50, 75, 100].map((milestone) => (
          <div
            key={milestone}
            className="absolute flex flex-col items-center"
            style={{ left: `${milestone}%`, transform: "translateX(-50%)" }}
          >
            <div className={`w-px h-2 ${pct >= milestone ? "bg-amber-600" : "bg-amber-800/30"}`} />
            <span className={`text-xs ${pct >= milestone ? "text-amber-600 dark:text-amber-400" : "text-amber-800/30"}`}>
              {milestone}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProgressBar;
