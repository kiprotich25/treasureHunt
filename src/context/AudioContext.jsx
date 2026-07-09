// AudioContext.jsx — Manages the single adventure music Audio object for the entire app.
//
// Rules enforced here:
//   • Only ONE Audio object exists for the whole app lifetime.
//   • Music starts ONLY when startAdventureMusic() is called (Day 1 click).
//   • Music fades in over 2 seconds on first start.
//   • Music loops continuously until stopAdventureMusic() is called.
//   • stopAdventureMusic() fades the music out over 3 s then stops it permanently.
//   • Once stopped, music will NOT restart (hasStartedRef guard).
//   • toggleSound() mutes/un-mutes in real-time without stopping playback.
//   • Any component can call startAdventureMusic / stopAdventureMusic / toggleSound via this context.

import { createContext, useContext, useRef, useCallback, useState } from "react";
import adventureTheme from "../assets/sounds/adventure-theme.mp3";

/* ── Context definition ── */
const AudioCtx = createContext(null);

/* ── Timing constants ── */
const FADE_IN_DURATION_MS  = 2000;
const FADE_OUT_DURATION_MS = 3000;
const FADE_STEP_MS         = 50; // tick interval for volume ramps

/**
 * AudioProvider — wraps the entire app so any component can access
 * startAdventureMusic(), stopAdventureMusic(), toggleSound(), and soundOn
 * without prop-drilling.
 */
export const AudioProvider = ({ children }) => {
  /* Single Audio object — created once and reused for the app lifetime */
  const audioRef     = useRef(null);

  /* Guards to prevent double-starts / double-stops */
  const hasStartedRef = useRef(false); // becomes true after Day 1 click
  const isPlayingRef  = useRef(false); // true while audio is actively playing
  const fadeTimerRef  = useRef(null);  // holds the setInterval for active fades

  /* ── Mute / un-mute state ──
     soundOn drives the button icon in Header; it is persisted to localStorage.
     Muting does NOT stop playback — it only sets volume to 0 so the audio
     keeps looping silently, and un-muting can restore it instantly.             */
  const [soundOn, setSoundOn] = useState(
    () => localStorage.getItem("treasure-sound") !== "false"
  );

  /* Target volume the fade-in aims for (1 when un-muted, 0 when muted) */
  const targetVolumeRef = useRef(soundOn ? 1 : 0);

  /* ── Initialise the Audio object (lazy, once) ── */
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current      = new Audio(adventureTheme);
      audioRef.current.loop = true;
      audioRef.current.volume = 0; // start silent; fade-in will raise it
    }
    return audioRef.current;
  }, []);

  /* ── Cancel any in-progress fade ── */
  const clearFade = useCallback(() => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  /**
   * startAdventureMusic()
   * ─────────────────────
   * • Called when the player clicks Day 1 for the first time.
   * • Does nothing if the music has already started once (hasStartedRef).
   * • Fades the volume from 0 → target over FADE_IN_DURATION_MS ms.
   *   (target is 0 if the user has already muted via the button.)
   *
   * ◀ MUSIC STARTS HERE ▶
   */
  const startAdventureMusic = useCallback(() => {
    // Guard: only start once — clicking Day 1 again (or any other day) does nothing
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;
    isPlayingRef.current  = true;

    const audio = getAudio();
    audio.volume      = 0;
    audio.currentTime = 0;

    // Play returns a Promise — catch any auto-play policy rejections gracefully
    audio.play().catch((err) => {
      console.warn("[AudioContext] Could not auto-play adventure music:", err);
      isPlayingRef.current = false;
    });

    // If the user has already muted the button, stay silent but keep playing
    const target = targetVolumeRef.current;
    if (target === 0) return;

    /* ── Fade in over FADE_IN_DURATION_MS ── */
    clearFade();
    const steps     = FADE_IN_DURATION_MS / FADE_STEP_MS;
    const increment = target / steps;

    fadeTimerRef.current = setInterval(() => {
      if (!audioRef.current) { clearFade(); return; }
      const next = Math.min(audioRef.current.volume + increment, target);
      audioRef.current.volume = next;
      if (next >= target) clearFade(); // fade-in complete
    }, FADE_STEP_MS);
  }, [getAudio, clearFade]);

  /**
   * stopAdventureMusic()
   * ─────────────────────
   * • Called 3 seconds after the treasure animation begins (from Treasure.jsx).
   * • Fades the volume from its current level → 0 over FADE_OUT_DURATION_MS ms.
   * • After the fade completes, pauses the audio and resets state.
   * • Safe to call multiple times — subsequent calls are no-ops.
   *
   * ◀ MUSIC STOPS HERE ▶
   */
  const stopAdventureMusic = useCallback(() => {
    if (!isPlayingRef.current) return; // already stopped or never started
    isPlayingRef.current = false;

    const audio = audioRef.current;
    if (!audio) return;

    // Cancel any fade currently running (e.g. mid-fade-in or mid-mute ramp)
    clearFade();

    const startVolume = audio.volume;
    const steps       = FADE_OUT_DURATION_MS / FADE_STEP_MS;
    const decrement   = startVolume / steps;

    /* ── Fade out over FADE_OUT_DURATION_MS ── */
    fadeTimerRef.current = setInterval(() => {
      if (!audioRef.current) { clearFade(); return; }
      const next = Math.max(audioRef.current.volume - decrement, 0);
      audioRef.current.volume = next;
      if (next <= 0) {
        clearFade();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, FADE_STEP_MS);
  }, [clearFade]);

  /**
   * toggleSound()
   * ─────────────
   * • Wired to the 🔊 / 🔇 button in Header.
   * • Muting:   ramps volume down to 0 quickly (300 ms) — keeps audio playing silently.
   * • Un-muting: ramps volume back up to 1 (300 ms) — only if music has started.
   * • Persists the preference to localStorage.
   * • Does NOT interfere with stopAdventureMusic() — once music is permanently
   *   stopped (treasure end), toggling the button is a visual-only no-op.
   */
  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      localStorage.setItem("treasure-sound", next);
      targetVolumeRef.current = next ? 1 : 0;

      const audio = audioRef.current;

      if (!audio || !hasStartedRef.current) {
        // Music hasn't started yet — just update the preference for when it does
        return next;
      }

      // Cancel any running fade so we can start a fresh ramp
      clearFade();

      const TOGGLE_RAMP_MS = 300;
      const steps          = TOGGLE_RAMP_MS / FADE_STEP_MS;

      if (!next) {
        /* ── Mute: ramp volume → 0 ── */
        const decrement = audio.volume / Math.max(steps, 1);
        fadeTimerRef.current = setInterval(() => {
          if (!audioRef.current) { clearFade(); return; }
          const v = Math.max(audioRef.current.volume - decrement, 0);
          audioRef.current.volume = v;
          if (v <= 0) clearFade();
        }, FADE_STEP_MS);
      } else if (isPlayingRef.current) {
        /* ── Un-mute: ramp volume → 1 (only if music is still playing) ── */
        const increment = (1 - audio.volume) / Math.max(steps, 1);
        fadeTimerRef.current = setInterval(() => {
          if (!audioRef.current) { clearFade(); return; }
          const v = Math.min(audioRef.current.volume + increment, 1);
          audioRef.current.volume = v;
          if (v >= 1) clearFade();
        }, FADE_STEP_MS);
      }

      return next;
    });
  }, [clearFade]);

  return (
    <AudioCtx.Provider value={{ startAdventureMusic, stopAdventureMusic, toggleSound, soundOn }}>
      {children}
    </AudioCtx.Provider>
  );
};

/**
 * useAdventureAudio — convenience hook so any component can call:
 *   const { startAdventureMusic, stopAdventureMusic, toggleSound, soundOn } = useAdventureAudio();
 */
export const useAdventureAudio = () => {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAdventureAudio must be used within an <AudioProvider>");
  }
  return ctx;
};
