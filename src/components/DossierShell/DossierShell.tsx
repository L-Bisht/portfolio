import type { ReactNode } from "react";
import type { NavData } from "../../data/nav";
import { useScrollSpy } from "./useScrollSpy";
import LeftRail from "./LeftRail";
import MobileHeader from "./MobileHeader";
import FloatingDock from "./FloatingDock";

interface DossierShellProps {
  data: NavData;
  children: ReactNode;
}

const SECTION_IDS = ["home", "about", "skills", "experience", "projects", "contact"];

/**
 * DossierShell
 *
 * Macro layout controller for the Sticky Dossier Hybrid pattern.
 *
 * Desktop (≥ 1024px):
 *   [LeftRail 280px sticky] | [Editorial content column — scrolls freely]
 *
 * Mobile (< 1024px):
 *   [MobileHeader sticky top] → content → [FloatingDock fixed bottom]
 */
export default function DossierShell({ data, children }: DossierShellProps) {
  const activeSectionId = useScrollSpy(SECTION_IDS);

  return (
    <>
      {/* ── Mobile Header ────────────────────────────────────────── */}
      <MobileHeader data={data} />

      {/* ── Shell: rail + editorial canvas ───────────────────────── */}
      <div className="flex min-h-screen">
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

      {/* ── Floating Bottom Dock — mobile only ───────────────────── */}
      <FloatingDock data={data} activeSectionId={activeSectionId} />
    </>
  );
}
