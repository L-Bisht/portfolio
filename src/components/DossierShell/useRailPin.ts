import { useState } from "react";

const STORAGE_KEY = "rail-pinned";

/**
 * useRailPin
 *
 * Manages the desktop left-rail pin preference, persisted across
 * browser sessions via localStorage.
 *
 * - `isPinned = true` → rail is locked open as a 280px static column.
 * - `isPinned = false` → rail defaults to 72px compact dock; it expands
 *   to a floating overlay on hover and collapses on mouse-leave.
 */
export function useRailPin() {
  const [isPinned, setIsPinned] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // storage unavailable — state still updates in memory
      }
      return next;
    });
  };

  return { isPinned, togglePin };
}
