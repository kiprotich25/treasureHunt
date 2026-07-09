// Treasure.jsx — Final glowing chest with confetti + coin explosion
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

/* ── Coin element ── */
const Coin = ({ id, x, y }) => (
  <div
    key={id}
    className="coin"
    style={{
      left: `${x}px`,
      top:  `${y}px`,
      "--dx":       `${(Math.random() - 0.5) * 400}px`,
      "--dy":       `${-(Math.random() * 300 + 100)}px`,
      "--duration": `${Math.random() * 0.8 + 0.8}s`,
    }}
  >
    🪙
  </div>
);

/**
 * TreasureModal — shown when the final day (treasure) is clicked and completed.
 * Fires confetti and coin animations.
 */
const TreasureModal = ({ onClose }) => {
  const [coins, setCoins] = useState([]);
  const chestRef = useRef(null);
  const [chestOpen, setChestOpen] = useState(false);

  /* Fire confetti */
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5, x: 0.5 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#00CED1", "#9400D3"],
        ticks: 200,
      });
    };

    const t1 = setTimeout(fire, 300);
    const t2 = setTimeout(fire, 1000);
    const t3 = setTimeout(fire, 1700);

    /* Spawn coins */
    const newCoins = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: window.innerWidth  / 2 + (Math.random() - 0.5) * 100,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
    }));
    setCoins(newCoins);

    setTimeout(() => setChestOpen(true), 400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center modal-backdrop"
        style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Coin burst */}
        {coins.map((c) => <Coin key={c.id} {...c} />)}

        <motion.div
          className="flex flex-col items-center gap-6 p-8 md:p-12 rounded-3xl max-w-md w-full mx-4"
          style={{
            background: "linear-gradient(145deg, #2a1206, #1a0a00)",
            border: "3px solid rgba(212,160,23,0.6)",
            boxShadow: "0 0 60px rgba(212,160,23,0.4), 0 0 120px rgba(212,160,23,0.2)",
          }}
          initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Chest */}
          <motion.div
            ref={chestRef}
            className="text-8xl md:text-9xl select-none"
            animate={
              chestOpen
                ? { scale: [1, 1.3, 1.15], rotate: [-3, 3, 0] }
                : { scale: 1 }
            }
            transition={{ duration: 0.6 }}
            style={{ filter: "drop-shadow(0 0 30px rgba(255,215,0,0.9))" }}
          >
            {chestOpen ? "💰" : "🔒"}
          </motion.div>

          {/* Sparkle ring */}
          <div className="relative">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <motion.div
                key={angle}
                className="absolute w-2 h-2 rounded-full bg-yellow-400"
                style={{
                  left: "50%",
                  top: "50%",
                  transformOrigin: "0 0",
                }}
                animate={{
                  transform: [
                    `rotate(${angle}deg) translate(40px) scale(0)`,
                    `rotate(${angle}deg) translate(60px) scale(1)`,
                    `rotate(${angle}deg) translate(40px) scale(0)`,
                  ],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 2, delay: 0.4, repeat: Infinity, repeatDelay: 0.5 }}
              />
            ))}
          </div>

          {/* Text */}
          <motion.h2
            className="font-pirate text-4xl md:text-5xl text-amber-300 text-center text-shadow-gold"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆 Congratulations! 🏆
          </motion.h2>

          <p className="font-adventure text-amber-400/80 text-center text-sm md:text-base">
            You completed the entire month!<br />
            The treasure is rightfully yours, Captain!
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            {["Pioneer", "Scholar", "Explorer", "Legend"].map((badge) => (
              <div
                key={badge}
                className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-adventure badge-glow"
              >
                ⚜ {badge}
              </div>
            ))}
          </div>

          <motion.button
            onClick={onClose}
            className="mt-2 px-8 py-3 rounded-full font-adventure font-bold text-amber-900 text-sm"
            style={{
              background: "linear-gradient(90deg, #D4A017, #FFD700, #D4A017)",
              boxShadow: "0 4px 20px rgba(212,160,23,0.5)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(212,160,23,0.8)" }}
            whileTap={{ scale: 0.95 }}
          >
            ⚓ Return to Map
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TreasureModal;
