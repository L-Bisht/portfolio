import type { ReactNode } from "react";
import type { NavData } from "../../data/nav";
import type { PatternMode } from "../../context/PatternContext";
import LeftRail from "./LeftRail";
import MobileHeader from "./MobileHeader";
import FloatingDock from "./FloatingDock";

interface DossierShellProps {
  data: NavData;
  activeSectionId: string;
  children: ReactNode;
  patternMode?: PatternMode;
  onTogglePatternMode?: () => void;
}

/**
 * DossierShell
 *
 * Macro layout controller for the Sticky Dossier Hybrid pattern.
 *
 * Desktop (≥ 1024px):
 *   [Rail host — permanently 72px fixed placeholder] | [Editorial content column]
 *
 *   The rail host retains a permanent fixed width of 72px in the document flow,
 *   guaranteeing zero Cumulative Layout Shift (CLS) on `#editorial-canvas`.
 *   LeftRail floats above as a fixed overlay that animates between 72px and 280px.
 *
 * Mobile (< 1024px):
 *   [MobileHeader sticky top] → content → [FloatingDock fixed bottom]
 */
export default function DossierShell({
  data,
  activeSectionId,
  children,
  patternMode,
  onTogglePatternMode,
}: DossierShellProps) {
  return (
    <>
      {/* ── Mobile Header ────────────────────────────────────────── */}
      <MobileHeader
        data={data}
        patternMode={patternMode}
        onTogglePatternMode={onTogglePatternMode}
      />

      {/* ── Shell: rail host + editorial canvas ──────────────────── */}
      <div className="flex">
        {/* Rail host — desktop only.
            Permanently fixed at 72px placeholder width in the flex flow.
            Guarantees zero CLS on the editorial content column. */}
        <div
          aria-hidden="true"
          className="hidden lg:block w-[72px] shrink-0 relative"
        >
          <LeftRail
            data={data}
            activeSectionId={activeSectionId}
          />
        </div>

        {/* Editorial content column — Contact + Footer live here too */}
        <main
          id="editorial-canvas"
          className="flex-1 min-w-0 flex flex-col"
        >
          {children}
        </main>
      </div>

      {/* ── Floating Bottom Dock — mobile only ───────────────────── */}
      <FloatingDock data={data} activeSectionId={activeSectionId} />
    </>
  );
}

