// AudioContext.jsx — Manages the single adventure music Audio object for the entire app.
//
// Rules enforced here:
//   • Only ONE Audio object exists for the whole app lifetime.
//   • Music starts ONLY when startAdventureMusic() is called (Day 1 click).
//   • Music fades in over 2 seconds on first start.
//   • Music loops continuously until stopAdventureMusic() is called.
//   • stopAdventureMusic() fades the music out over 3 seconds then stops it.
//   • Once stopped, music will NOT restart (hasStartedRef guard).
//   • Any component can call startAdventureMusic / stopAdventureMusic via this context.

import { createContext, useContext, useRef, useCallback } from "react";
import adventureTheme from "../assets/sounds/adventure-theme.mp3";

/* ── Context definition ── */
const AudioCtx = createContext(null);

/* ── Fade helpers ── */
const FADE_IN_DURATION_MS  = 2000;
const FADE_OUT_DURATION_MS = 3000;
const FADE_STEP_MS         = 50; // how often (ms) we tick the volume ramp

/**
 * AudioProvider — wraps the entire app so any component can access
 * startAdventureMusic() and stopAdventureMusic() without prop-drilling.
 */
export const AudioProvider = ({ children }) => {
  /* Single Audio object — created once and reused for the app lifetime */
  const audioRef        = useRef(null);

  /* Guards to prevent double-starts / double-stops */
  const hasStartedRef   = useRef(false); // becomes true after Day 1 click
  const isPlayingRef    = useRef(false); // true while audio is actively playing
  const fadeTimerRef    = useRef(null);  // holds the setInterval for active fades

  /* ── Initialise the Audio object (lazy, once) ── */
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current        = new Audio(adventureTheme);
      audioRef.current.loop   = true;
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
   * • Fades the volume from 0 → 1 over FADE_IN_DURATION_MS milliseconds.
   *
   * ◀ MUSIC STARTS HERE ▶
   */
  const startAdventureMusic = useCallback(() => {
    // Guard: only start once — clicking Day 1 again does nothing
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;
    isPlayingRef.current  = true;

    const audio    = getAudio();
    audio.volume   = 0;
    audio.currentTime = 0;

    // Play returns a Promise — catch any auto-play policy rejections gracefully
    audio.play().catch((err) => {
      console.warn("[AudioContext] Could not auto-play adventure music:", err);
      isPlayingRef.current = false;
    });

    /* ── Fade in over FADE_IN_DURATION_MS ── */
    clearFade();
    const steps     = FADE_IN_DURATION_MS / FADE_STEP_MS;
    const increment = 1 / steps;

    fadeTimerRef.current = setInterval(() => {
      if (!audioRef.current) { clearFade(); return; }

      const next = Math.min(audioRef.current.volume + increment, 1);
      audioRef.current.volume = next;

      if (next >= 1) clearFade(); // fade-in complete
    }, FADE_STEP_MS);
  }, [getAudio, clearFade]);

  /**
   * stopAdventureMusic()
   * ─────────────────────
   * • Called 3 seconds after the treasure animation begins (from Treasure.jsx).
   * • Fades the volume from its current level → 0 over FADE_OUT_DURATION_MS ms.
   * • After the fade completes, pauses the audio and resets state.
   * • If this is called while a fade-in is still running, it cancels that fade
   *   and immediately starts fading out from whatever volume was reached.
   * • Safe to call multiple times — subsequent calls are no-ops.
   *
   * ◀ MUSIC STOPS HERE ▶
   */
  const stopAdventureMusic = useCallback(() => {
    if (!isPlayingRef.current) return; // already stopped or never started
    isPlayingRef.current = false;

    const audio = audioRef.current;
    if (!audio) return;

    // Cancel any fade currently running (e.g. mid-fade-in)
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

  return (
    <AudioCtx.Provider value={{ startAdventureMusic, stopAdventureMusic }}>
      {children}
    </AudioCtx.Provider>
  );
};

/**
 * useAdventureAudio — convenience hook so any component can call:
 *   const { startAdventureMusic, stopAdventureMusic } = useAdventureAudio();
 */
export const useAdventureAudio = () => {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAdventureAudio must be used within an <AudioProvider>");
  }
  return ctx;
};
