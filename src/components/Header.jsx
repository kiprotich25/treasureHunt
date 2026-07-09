// Header.jsx — Top banner with title, subtitle and progress
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiVolume2, FiVolumeX, FiSearch } from "react-icons/fi";
import { GiCompass, GiFlame } from "react-icons/gi";
import ProgressBar from "./ProgressBar";
import { completedDays, totalDays, streakCount } from "../data/learningData";

const Header = ({
  darkMode,
  onToggleDark,
  soundOn,
  onToggleSound,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  return (
    <motion.header
      className="relative z-30 px-4 md:px-8 pt-6 pb-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* ── Top Row: Title + Controls ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        {/* Title Block */}
        <div className="flex items-center gap-4">
          {/* Animated compass */}
          <motion.div
            className="hidden sm:flex items-center justify-center w-14 h-14 rounded-full bg-amber-900/20 border-2 border-amber-700/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <GiCompass className="text-3xl text-amber-600 dark:text-amber-400" />
          </motion.div>

          <div>
            <motion.h1
              className="font-pirate text-3xl sm:text-4xl md:text-5xl text-amber-900 dark:text-amber-300 text-shadow-gold leading-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Learning Treasure Hunt
            </motion.h1>
            <motion.p
              className="font-adventure text-sm md:text-base text-amber-700 dark:text-amber-500 tracking-widest mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ⚓ My Learning Journey ⚓
            </motion.p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Streak Badge */}
          {streakCount > 0 && (
            <motion.div
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-700 dark:text-orange-400"
              whileHover={{ scale: 1.05 }}
              title={`${streakCount} day streak!`}
            >
              <GiFlame className="text-orange-500" />
              <span className="font-bold text-sm">{streakCount}</span>
            </motion.div>
          )}

          {/* Dark mode toggle */}
          <motion.button
            onClick={onToggleDark}
            className="p-2.5 rounded-full bg-amber-800/20 border border-amber-700/30 text-amber-800 dark:text-amber-300 hover:bg-amber-800/40 transition-colors"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          </motion.button>

          {/* Sound toggle */}
          <motion.button
            onClick={onToggleSound}
            className="p-2.5 rounded-full bg-amber-800/20 border border-amber-700/30 text-amber-800 dark:text-amber-300 hover:bg-amber-800/40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={soundOn ? "Mute sounds" : "Enable sounds"}
          >
            {soundOn ? <FiVolume2 className="text-xl" /> : <FiVolumeX className="text-xl" />}
          </motion.button>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <ProgressBar completed={completedDays} total={totalDays} />

      {/* ── Search & Filter Row ── */}
      {/* ✏️ EDITED: stacks vertically on mobile, side-by-side on sm+ */}
      <motion.div
        className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:min-w-[180px] sm:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400" />
          <input
            type="text"
            placeholder="Search topics, titles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full text-sm bg-amber-50/80 dark:bg-amber-950/60 border-2 border-amber-700/30 text-amber-900 dark:text-amber-200 placeholder-amber-600/60 dark:placeholder-amber-600 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        {/* Filter Buttons — wrap on tiny screens */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all",        label: "All Days" },
            { id: "completed",  label: "✓ Done" },
            { id: "incomplete", label: "○ Upcoming" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`filter-btn ${filter === f.id ? "active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
