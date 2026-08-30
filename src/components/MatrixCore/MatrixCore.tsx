import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MatrixCoreProps {
  /** The raw "encrypted" content displayed before hover. Can be a string or
   *  arbitrary JSX (e.g. a block of scrambled monospace text). */
  encryptedContent: React.ReactNode;

  /** The human-readable content revealed after the decryption animation
   *  completes. */
  decryptedContent: React.ReactNode;

  /** When true the core stays decrypted after the first hover; when false
   *  (default) it reverts to the encrypted state on mouse-leave. */
  stayDecrypted?: boolean;

  /** Optional extra class names forwarded to the outer wrapper. */
  className?: string;

  /** Optional aria-label for accessibility. */
  ariaLabel?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?";

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

// ---------------------------------------------------------------------------
// Sub-component: ScrambleText
// Progressively reveals `target` text character-by-character while scrambling
// the as-yet-unrevealed tail.
// ---------------------------------------------------------------------------

interface ScrambleTextProps {
  target: string;
  /** Duration of the full scramble-reveal in ms. */
  durationMs?: number;
  /** Called when the reveal finishes. */
  onComplete?: () => void;
}

function ScrambleText({
  target,
  durationMs = 700,
  onComplete,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState<string>(() =>
    Array.from({ length: target.length }, randomChar).join("")
  );
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const tick = useCallback(
    (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const revealedCount = Math.floor(progress * target.length);

      const next =
        target.slice(0, revealedCount) +
        Array.from({ length: target.length - revealedCount }, randomChar).join(
          ""
        );

      setDisplay(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        onComplete?.();
      }
    },
    [target, durationMs, onComplete]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return <span aria-hidden="true">{display}</span>;
}

// ---------------------------------------------------------------------------
// MatrixCore
// ---------------------------------------------------------------------------

type Phase = "encrypted" | "decrypting" | "decrypted";

export function MatrixCore({
  encryptedContent,
  decryptedContent,
  stayDecrypted = false,
  className = "",
  ariaLabel,
}: MatrixCoreProps) {
  const [phase, setPhase] = useState<Phase>("encrypted");

  const handleMouseEnter = useCallback(() => {
    if (phase === "encrypted") {
      setPhase("decrypting");
    }
  }, [phase]);

  const handleMouseLeave = useCallback(() => {
    if (!stayDecrypted) {
      setPhase("encrypted");
    }
  }, [stayDecrypted]);

  const handleDecryptComplete = useCallback(() => {
    setPhase("decrypted");
  }, []);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      role={ariaLabel ? "region" : undefined}
      // Subtle border pulse while decrypting
      animate={
        phase === "decrypting"
          ? { boxShadow: "0 0 0 1px rgba(99,102,241,0.6)" }
          : { boxShadow: "0 0 0 1px rgba(99,102,241,0)" }
      }
      transition={{ duration: 0.3 }}
    >
      {/* Encrypted state */}
      <AnimatePresence mode="wait" initial={false}>
        {phase === "encrypted" && (
          <motion.div
            key="encrypted"
            data-testid="matrix-core-encrypted"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {encryptedContent}
          </motion.div>
        )}

        {/* Decrypting state – ScrambleText only works on plain strings that we
            expose via the data-decrypt-text attribute trick. For arbitrary JSX
            content we do a rapid flash effect and then transition. */}
        {phase === "decrypting" && (
          <motion.div
            key="decrypting"
            data-testid="matrix-core-decrypting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            <DecryptingOverlay onComplete={handleDecryptComplete} />
          </motion.div>
        )}

        {/* Decrypted state */}
        {phase === "decrypted" && (
          <motion.div
            key="decrypted"
            data-testid="matrix-core-decrypted"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {decryptedContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline overlay – purely decorative */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          phase !== "encrypted" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.03) 2px, rgba(99,102,241,0.03) 4px)",
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// DecryptingOverlay
// Shows a rapidly-cycling block of random matrix characters for a fixed
// duration, then calls `onComplete`.
// ---------------------------------------------------------------------------

interface DecryptingOverlayProps {
  onComplete: () => void;
  durationMs?: number;
  rows?: number;
  cols?: number;
}

function DecryptingOverlay({
  onComplete,
  durationMs = 650,
  rows = 6,
  cols = 24,
}: DecryptingOverlayProps) {
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, randomChar)
    )
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Rapidly shuffle characters
    intervalRef.current = setInterval(() => {
      setGrid(
        Array.from({ length: rows }, () =>
          Array.from({ length: cols }, randomChar)
        )
      );
    }, 40);

    // Stop after durationMs
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      onComplete();
    }, durationMs);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, [rows, cols, durationMs, onComplete]);

  return (
    <div
      aria-hidden="true"
      className="font-mono text-[10px] leading-[1.4] text-indigo-400/70 dark:text-indigo-300/60 select-none overflow-hidden p-4"
    >
      {grid.map((row, r) => (
        <div key={r} className="whitespace-pre">
          {row.join("")}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MatrixCoreText
// A convenience wrapper for the common case: a plain-text label with the
// scramble-character reveal animation applied directly to the text string.
// ---------------------------------------------------------------------------

export interface MatrixCoreTextProps {
  /** Text shown in encrypted form (displayed char-by-char via scramble). */
  label: string;
  /** Rendered after decryption completes. Falls back to `label` if omitted. */
  decryptedLabel?: string;
  stayDecrypted?: boolean;
  className?: string;
  /** Extra classes for the decrypted text node. */
  decryptedClassName?: string;
  /** Extra classes for the encrypted text node. */
  encryptedClassName?: string;
}

export function MatrixCoreText({
  label,
  decryptedLabel,
  stayDecrypted = false,
  className = "",
  decryptedClassName = "",
  encryptedClassName = "",
}: MatrixCoreTextProps) {
  const resolved = decryptedLabel ?? label;

  return (
    <MatrixCore
      stayDecrypted={stayDecrypted}
      className={className}
      ariaLabel={resolved}
      encryptedContent={
        <span
          data-testid="matrix-core-text-encrypted"
          className={`font-mono text-indigo-400/60 dark:text-indigo-300/50 select-none ${encryptedClassName}`}
        >
          {Array.from({ length: label.length }, randomChar).join("")}
        </span>
      }
      decryptedContent={
        <span
          data-testid="matrix-core-text-decrypted"
          className={`${decryptedClassName}`}
        >
          {resolved}
        </span>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// MatrixCoreCard
// A glassmorphism card wrapper that displays a monolithic "encrypted block"
// initially and decrypts to reveal structured `children` on hover.
// ---------------------------------------------------------------------------

export interface MatrixCoreCardProps {
  children: React.ReactNode;
  /** Number of placeholder rows in the encrypted state. Defaults to 8. */
  encryptedRows?: number;
  stayDecrypted?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function MatrixCoreCard({
  children,
  encryptedRows = 8,
  stayDecrypted = false,
  className = "",
  ariaLabel,
}: MatrixCoreCardProps) {
  const encryptedBlock = (
    <div
      aria-hidden="true"
      className="font-mono text-[11px] leading-[1.6] text-indigo-400/50 dark:text-indigo-300/40 select-none space-y-1 p-6"
    >
      {Array.from({ length: encryptedRows }, (_, i) => (
        <div key={i} className="flex gap-1 flex-wrap">
          {/* Vary the line width slightly for a realistic look */}
          {Array.from(
            { length: 20 + Math.floor(Math.sin(i * 2.3) * 6) },
            (__, j) => (
              <RandomChar key={j} />
            )
          )}
        </div>
      ))}
    </div>
  );

  return (
    <MatrixCore
      encryptedContent={encryptedBlock}
      decryptedContent={
        <div data-testid="matrix-core-card-decrypted">{children}</div>
      }
      stayDecrypted={stayDecrypted}
      className={`group overflow-hidden rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-shadow duration-300 ${className}`}
      ariaLabel={ariaLabel}
    />
  );
}

/** Tiny component that renders and keeps a stable random character in memory. */
function RandomChar() {
  const char = useRef(randomChar());
  return <span>{char.current}</span>;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { ScrambleText };
export default MatrixCore;
