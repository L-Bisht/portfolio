import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { NavData } from "../../data/nav";
import LeftRail from "./LeftRail";
import MobileHeader from "./MobileHeader";
import FloatingDock from "./FloatingDock";
import { useRailPin } from "./useRailPin";

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
 *   [Rail host — 72px unpinned | 280px pinned] | [Editorial content column]
 *
 *   The rail host is a layout placeholder that reserves space in the flex row.
 *   When unpinned, LeftRail is `position: absolute` inside the host, so it
 *   can expand to 280px as a floating glass overlay without reflow.
 *   When pinned, LeftRail is static and the host grows to 280px together.
 *
 * Mobile (< 1024px):
 *   [MobileHeader sticky top] → content → [FloatingDock fixed bottom]
 */
export default function DossierShell({ data, activeSectionId, children }: DossierShellProps) {
  const { isPinned, togglePin } = useRailPin();

  const hostWidth = isPinned ? 280 : 72;

  return (
    <>
      {/* ── Mobile Header ────────────────────────────────────────── */}
      <MobileHeader data={data} />

      {/* ── Shell: rail host + editorial canvas ──────────────────── */}
      <div className="flex">
        {/* Rail host — desktop only.
            Acts as the layout placeholder; its width drives content offset.
            LeftRail renders absolutely inside when unpinned (overlay),
            or statically when pinned (column). */}
        <motion.div
          aria-hidden="true"
          className="hidden lg:block shrink-0 relative"
          animate={{ width: hostWidth }}
          transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
        >
          <LeftRail
            data={data}
            activeSectionId={activeSectionId}
            isPinned={isPinned}
            togglePin={togglePin}
          />
        </motion.div>

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
