import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type PatternMode = "cubes" | "dots";

export interface PatternContextValue {
  patternMode: PatternMode;
  setPatternMode: (mode: PatternMode) => void;
  togglePatternMode: () => void;
}

const defaultPatternContext: PatternContextValue = {
  patternMode: "cubes",
  setPatternMode: () => {},
  togglePatternMode: () => {},
};

const PatternContext = createContext<PatternContextValue | null>(null);

function getInitialPatternMode(): PatternMode {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return "cubes";
  }
  try {
    const stored = localStorage.getItem("pattern_mode");
    if (stored === "cubes" || stored === "dots") return stored;
    return "cubes";
  } catch {
    return "cubes";
  }
}

export function PatternProvider({
  children,
  initialMode,
}: {
  children: ReactNode;
  initialMode?: PatternMode;
}) {
  const [patternMode, setPatternModeState] = useState<PatternMode>(
    () => initialMode ?? getInitialPatternMode()
  );

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("pattern_mode", patternMode);
      }
    } catch {
      // ignore
    }
  }, [patternMode]);

  const setPatternMode = useCallback((mode: PatternMode) => {
    setPatternModeState(mode);
  }, []);

  const togglePatternMode = useCallback(() => {
    setPatternModeState((prev) => (prev === "cubes" ? "dots" : "cubes"));
  }, []);

  return (
    <PatternContext.Provider
      value={{ patternMode, setPatternMode, togglePatternMode }}
    >
      {children}
    </PatternContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePattern(): PatternContextValue {
  const ctx = useContext(PatternContext);
  return ctx ?? defaultPatternContext;
}
