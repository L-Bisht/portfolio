# Domain Glossary

This document defines the core domain concepts used in the portfolio's architecture and content strategy.

## Core Concepts

*   **Impact Timeline**: A chronologically structured list of professional roles. The primary organizing principle is the *impact* achieved (e.g., migrations, system scale) rather than just the job title or date.
*   **Skill Category**: A logical grouping of technologies (e.g., "Core Engineering", "AI & Emerging Tech"). Replaces arbitrary percentage-based skill metrics.
*   **Skill**: A strictly label-based entity under a Skill Category. It does not contain proficiency scores or context metadata, keeping the taxonomy flat and manageable.
*   **Versatile / AI-Augmented Developer**: The overarching persona of the portfolio. Represents an engineer who leverages AI tools to bridge frontend and backend capabilities, driving rapid feature execution through methodologies like Domain Driven Design.
*   **Sticky Dossier Hybrid**: The macro layout architecture pairing a persistent anchor rail (context, navigation, live status) with an independently flowing asymmetric editorial content canvas.
*   **Magazine Case Study**: An editorial project presentation format that pairs technical problem-solving narrative, architectural metrics, and interactive previews side-by-side, replacing generic card grids.
*   **Executive Ledger**: A two-column chronological record of tenure replacing decorative line-and-dot timelines, prioritizing quantified metrics and architectural leadership.
*   **Architectural Toolkit**: A capability-oriented system representation replacing isolated skill badges, grouping technologies into operational layers (e.g., Interface Engine, Distributed Systems, AI Orchestration).
*   **Collapsible Anchor Rail**: An evolution of the Sticky Dossier anchor rail operating in a compact translucent mode (72px) with manual toggle expansion to a 280px floating overlay. It guarantees zero layout shift on the editorial canvas, employs ultra-translucent glass, and features icon-only collapsed state and full icon-plus-label expanded state.
*   **Editorial Glass Strata**: The unified card design system standardizing all section surfaces with translucent dual-mode glass (`bg-white/20 dark:bg-slate-900/40`), reactive top-edge hairline glow, and radial hover spotlight, allowing background patterns to remain visible.
*   **Quarter-Circle Bubble Motif**: An architectural corner bubble quadrant centered at the card's corner vertex. The container edges act as the circle radii, with endpoints anchored flush against the edges and a convex arc bulging inward into the card surface with subtle concentric hairlines.
*   **Architectural Capability Chip**: A capability-oriented badge featuring an always-visible SVG technology brand icon alongside the skill label, responsive to tier accent hover highlights without expanding descriptor text.
*   **Interactive Lattice Background**: A full-canvas interactive backdrop rendering either an interactive Dot Matrix or an Isometric Cubes Wireframe Lattice that dynamically illuminates under cursor proximity with section-specific accent colors.
*   **Centralized Social Registry**: The canonical, single-source-of-truth configuration for verified social links, portfolio profiles, and developer credentials shared identically across all views.
*   **Commanding Headline**: Large-scale responsive clamp typography featuring animated word reveals and gradient keyword highlighting.
*   **Section Scaffold**: A standardized layout primitive enclosing all editorial sections with a uniform `max-w-6xl` container, balanced responsive gutters, an animated section eyebrow, and a clipped commanding headline with descender compensation (`pb-3 -mb-3 pt-1 -mt-1`).
*   **Hemispherical Dot Matrix Bulge**: The 3D perspective protrusion model for the dot matrix background where cursor proximity induces a hemispherical elevation, radial dot displacement, dynamic scale dilation, and damped harmonic spring compression on click.
*   **Precision Cyan Accent Theme**: The primary design system palette replacing generic indigo/violet presets with high-performance Electric Cyan (`#06b6d4`), Sky Blue (`#0ea5e9`), and Cobalt Blue (`#2563eb`).
*   **Adaptive Idle Sleep Loop**: An event-driven canvas rendering lifecycle that suspends `requestAnimationFrame` when pointer motion, ripples, and color transitions settle, waking dynamically on user input or state change.
*   **Scroll-Damped Canvas**: A mobile-optimized canvas execution mode that halts frame rasterization during active touch-scrolling gestures to preserve 60fps compositor bandwidth.
*   **Dual-Mode Editorial Glass**: A responsive extension of the Editorial Glass Strata that delivers full `backdrop-blur-xl` on desktop while stepping down to `backdrop-blur-sm` with higher opacity on mobile viewports to prevent GPU fill-rate exhaustion.
*   **Executive Telemetry Card**: A high-signal architectural glass surface anchored in the Hero's asymmetric two-column split, presenting live operational metadata (system availability, active engineering focus, primary stack, and location) with quiet precision.

