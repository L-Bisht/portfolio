import type { ReactNode } from "react";
import type { NavData } from "../../data/nav";
import { useScrollSpy } from "./useScrollSpy";
import LeftRail from "./LeftRail";
import MobileHeader from "./MobileHeader";
import FloatingDock from "./FloatingDock";

interface DossierShellProps {
  data: NavData;
  children: ReactNode;
  /**
   * `finale` renders below the dual-pane rail+canvas, spanning the full
   * viewport width — used for the cinematic Contact section and Footer.
   */
  finale?: ReactNode;
}

const SECTION_IDS = ["home", "about", "skills", "experience", "projects", "contact"];

/**
 * DossierShell
 *
 * Macro layout controller for the Sticky Dossier Hybrid pattern.
 *
 * Desktop (≥ 1024px):
 *   [LeftRail 280px sticky] | [Editorial content column — scrolls freely]
 *   ──────────────────────────────────────────────────────────────────────
 *   [Finale — full-width, below dual-pane: Contact + Footer]
 *
 * Mobile (< 1024px):
 *   [MobileHeader sticky top] → content → finale → [FloatingDock fixed bottom]
 */
export default function DossierShell({ data, children, finale }: DossierShellProps) {
  const activeSectionId = useScrollSpy(SECTION_IDS);

  return (
    <>
      {/* ── Mobile Header ────────────────────────────────────────── */}
      <MobileHeader data={data} />

      {/* ── Shell: rail + editorial canvas ───────────────────────── */}
      <div className="flex">
        {/* Left Rail — desktop only */}
        <LeftRail data={data} activeSectionId={activeSectionId} />

        {/* Editorial content column */}
        <main
          id="editorial-canvas"
          className="flex-1 min-w-0 flex flex-col"
        >
          {children}
        </main>
      </div>

      {/* ── Cinematic Finale — full-width breakout ────────────────── */}
      {finale && (
        <div id="contact-finale" className="w-full">
          {finale}
        </div>
      )}

      {/* ── Floating Bottom Dock — mobile only ───────────────────── */}
      <FloatingDock data={data} activeSectionId={activeSectionId} />
    </>
  );
}
