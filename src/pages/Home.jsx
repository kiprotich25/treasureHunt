// Home.jsx — Main page that wires all components together
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header       from "../components/Header";
import Map          from "../components/Map";
import LearningModal from "../components/LearningModal";
import TreasureModal from "../components/Treasure";
import Footer        from "../components/Footer";
import { learningData } from "../data/learningData";

const Home = () => {
  /* ── State ── */
  const [selectedDay, setSelectedDay] = useState(null);
  const [showTreasure, setShowTreasure] = useState(false);
  const [filter, setFilter]             = useState("all");
  const [searchQuery, setSearchQuery]   = useState("");
  const [darkMode, setDarkMode]         = useState(() =>
    localStorage.getItem("treasure-dark") === "true"
  );
  const [soundOn, setSoundOn] = useState(() =>
    localStorage.getItem("treasure-sound") !== "false"
  );

  /* ── Dark mode effect ── */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("treasure-dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("treasure-sound", soundOn);
  }, [soundOn]);

  /* ── Node click handler ── */
  const handleNodeClick = useCallback((day) => {
    if (day.locationType === "treasure" && day.completed) {
      setShowTreasure(true);
      return;
    }
    setSelectedDay(day);
  }, []);

  const closeModal    = useCallback(() => setSelectedDay(null), []);
  const closeTreasure = useCallback(() => setShowTreasure(false), []);

  return (
    <div className={`min-h-screen parchment-bg transition-colors duration-500 ${darkMode ? "dark" : ""}`}>
      <div className="max-w-7xl mx-auto px-2 md:px-6 pb-6">
        {/* ── Header ── */}
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
        />

        {/* ── Map ── */}
        <motion.div
          className="mt-4 map-scroll overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div style={{ minWidth: "500px" }}>
            <Map
              data={learningData}
              filter={filter}
              searchQuery={searchQuery}
              onNodeClick={handleNodeClick}
            />
          </div>
        </motion.div>

        {/* ── Legend ── */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { color: "bg-amber-400",  label: "Completed",  border: "border-amber-600" },
            { color: "bg-blue-400",   label: "Current Day", border: "border-blue-600" },
            { color: "bg-stone-300",  label: "Upcoming",   border: "border-stone-400" },
          ].map(({ color, label, border }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${color} border-2 ${border}`} />
              <span className="font-adventure text-xs text-amber-800 dark:text-amber-400">{label}</span>
            </div>
          ))}
        </motion.div>

        <Footer />
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {selectedDay && (
          <LearningModal key="modal" day={selectedDay} onClose={closeModal} />
        )}
        {showTreasure && (
          <TreasureModal key="treasure" onClose={closeTreasure} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
