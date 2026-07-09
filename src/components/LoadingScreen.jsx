// LoadingScreen.jsx — Cinematic loading entrance animation
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase sequence: 0 → dark → 1 → title → 2 → loading → 3 → done
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => onComplete(), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background ocean shimmer */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${200 + i * 120}px`,
                  height: `${200 + i * 120}px`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `-${(200 + i * 120) / 2}px`,
                  marginTop: `-${(200 + i * 120) / 2}px`,
                  border: `1px solid rgba(26,107,138,${0.15 - i * 0.02})`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
                transition={{ duration: 15 + i * 3, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>

          {/* Compass rose decoration */}
          <motion.div
            className="absolute text-6xl text-yellow-600 opacity-10 select-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.div>

          {/* Ship icon */}
          <motion.div
            className="text-7xl mb-6 select-none"
            initial={{ y: 40, opacity: 0 }}
            animate={phase >= 1 ? { y: [0, -8, 0], opacity: 1 } : {}}
            transition={{ y: { duration: 3, repeat: Infinity }, opacity: { duration: 0.6 } }}
          >
            ⚓
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-pirate text-5xl md:text-7xl text-amber-400 text-center text-shadow-gold mb-2 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Learning
          </motion.h1>
          <motion.h1
            className="font-pirate text-5xl md:text-7xl text-yellow-300 text-center text-shadow-gold mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Treasure Hunt
          </motion.h1>

          {/* Loading dots */}
          <motion.div
            className="flex gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-amber-400"
                animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </motion.div>

          <motion.p
            className="text-amber-300/60 mt-4 font-adventure text-sm tracking-widest"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            CHARTING THE COURSE...
          </motion.p>

          {/* Corner decorations */}
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-amber-600/20 text-3xl select-none`}>⚜</div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
