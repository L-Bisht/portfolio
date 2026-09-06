import type { ReactNode } from "react";
import type { NavData } from "../../data/nav";
import LeftRail from "./LeftRail";
import MobileHeader from "./MobileHeader";
import FloatingDock from "./FloatingDock";

interface DossierShellProps {
  data: NavData;
  activeSectionId: string;
  children: ReactNode;
}

/**
 * DossierShell
 *
 * Macro layout controller for the Sticky Dossier Hybrid pattern.
 *
 * Desktop (≥ 1024px):
 *   [LeftRail 280px sticky top-0] | [Editorial content column — scrolls freely]
 *
 *   The left rail uses `sticky top-0 self-start` so it remains anchored beside
 *   ALL content — including Contact and Footer — at every scroll position.
 *   Contact and Footer must be passed as children (not a separate "finale"
 *   slot) to keep them inside the flex row alongside the rail.
 *
 * Mobile (< 1024px):
 *   [MobileHeader sticky top] → content → [FloatingDock fixed bottom]
 */
export default function DossierShell({ data, activeSectionId, children }: DossierShellProps) {

  return (
    <>
      {/* ── Mobile Header ────────────────────────────────────────── */}
      <MobileHeader data={data} />

      {/* ── Shell: rail + editorial canvas ───────────────────────── */}
      <div className="flex">
        {/* Left Rail — desktop only, sticky through full page height */}
        <LeftRail data={data} activeSectionId={activeSectionId} />

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
