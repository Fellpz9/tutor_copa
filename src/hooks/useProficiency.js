import { useState, useCallback } from "react";
import { INITIAL_PROFICIENCY } from "../utils/constants.js";

export function useProficiency() {
  const [proficiency, setProficiency] = useState(INITIAL_PROFICIENCY);
  const [badges, setBadges] = useState([]);

  const addProficiency = useCallback((country, delta) => {
    setProficiency((prev) => {
      const current = prev[country] || 0;
      const newVal = Math.min(100, current + delta);
      const wasComplete = current >= 100;

      if (newVal >= 100 && !wasComplete) {
        setBadges((b) => (b.includes(country) ? b : [...b, country]));
      }

      return { ...prev, [country]: newVal };
    });
  }, []);

  const totalCompleted = Object.values(proficiency).filter(
    (v) => v >= 100
  ).length;

  const avgProficiency = Math.round(
    Object.values(proficiency).reduce((a, b) => a + b, 0) /
      Object.keys(proficiency).length
  );

  return {
    proficiency,
    setProficiency,
    badges,
    setBadges,
    addProficiency,
    totalCompleted,
    avgProficiency,
  };
}
