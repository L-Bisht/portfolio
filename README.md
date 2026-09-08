# Lalit Singh Bisht — Portfolio & Architectural Dossier

> A modern, high-performance developer portfolio and design system showcase built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**. Engineered as a **Sticky Dossier Hybrid** with a decoupled data layer, interactive 3D canvas backgrounds, and precision editorial layouts.

[Live Demo](https://l-bisht.github.io/portfolio) · [Report Issue](https://github.com/L-Bisht/portfolio/issues) · [Contact](mailto:lbisht1996@gmail.com)

---

## 🏛️ Architectural Overview

This portfolio departs from generic single-page landing templates in favor of a **Sticky Dossier Hybrid** layout:

- **Macro Layout Architecture**: A dual-axis layout pairing a persistent, ultra-translucent **Collapsible Anchor Rail** (context, navigation, live availability) with an independently scrolling, asymmetric **Editorial Canvas**.
- **Decoupled Data Architecture**: Complete separation of content and presentation. All textual copy, case studies, career ledgers, architectural competencies, and verified credentials live strictly inside `src/data/*.ts`.
- **Dual-Mode 3D Canvas Background**: An interactive backdrop supporting an **Isometric Wireframe Cube Lattice** and a **Hemispherical 3D Dot Matrix** with dynamic cursor proximity elevation, radial repulsion physics, and damped harmonic spring restitution.
- **Editorial Glass Strata**: Standardized translucent card surfaces (`bg-white/20 dark:bg-slate-900/40`) with real-time radial border hover spotlights and Quarter-Circle Bubble architectural motifs that maintain visual continuity with the 3D canvas underneath.
- **Precision Cyan Design System**: A calibrated palette featuring Electric Cyan (`#06b6d4`), Sky Blue (`#0ea5e9`), and Cobalt Blue (`#2563eb`), replacing generic violet/indigo themes.

---

## ✨ Key Features

- **Collapsible Anchor Rail**:
  - Operates in a compact 72px translucent glass rail with icon-only state on desktop.
  - Expands via manual toggle to a 280px floating overlay with full typography and social links without causing layout shift on the editorial canvas.
  - Integrated real-time `useScrollSpy` active section indicator.
  - Dual-mode background pattern switcher (Cubes lattice / Dots matrix).
- **Responsive Mobile Navigation**:
  - Sticky `MobileHeader` with integrated animated theme toggle and background pattern switcher.
  - Floating bottom dock (`FloatingDock`) for thumb-accessible quick navigation without UI collisions.
- **3D Interactive Canvas Background Modes**:
  - **Isometric Cube Lattice**: Orthographically projected wireframe cubes with cursor proximity illumination and section-specific accent lighting.
  - **Hemispherical Dot Matrix**: 3D perspective particle matrix featuring a hemispherical protrusion model under the cursor, radial dot displacement, scale dilation, and harmonic spring bounce.
- **Section Scaffold Layout Primitive**:
  - Uniform `max-w-6xl` responsive gutter system.
  - Animated hairline eyebrow badge.
  - Commanding headline clamp typography (`clamp(2.2rem, 5vw, 5rem)`) with staggered per-word reveals and descender overflow clearance (`pb-3 -mb-3 pt-1 -mt-1`) eliminating text clipping.
- **Editorial Experience Ledger**:
  - Two-column chronological journey replacing decorative timeline dots.
  - Quantified impact tags (`40% deployment time reduction`, etc.) and system scale highlights.
- **Magazine Case Study Showcase**:
  - Technical problem/solution narrative pairing architectural challenges with implemented solutions.
  - Interactive previews, live demo endpoints, and repository links.
- **Architectural Toolkit**:
  - Grouped into operational tiers: *Interface & Experience Engine*, *Distributed Systems & Cloud Architecture*, and *AI Systems & Intelligence Orchestration*.
  - Capability chips with hover feedback and technology taxonomy.
- **Centralized Social Registry**:
  - Single source of truth for developer social profiles, external credentials, and contact endpoints (`src/data/social.ts`).
- **Seamless Light / Dark Modes**:
  - Instant theme switching with zero flash, persisting preference to `localStorage`.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) (`19.1`) | Modern concurrent React primitives and hooks |
| **Build Tool** | [Vite 7](https://vitejs.dev/) (`7.1`) | Ultra-fast HMR and optimized production bundling |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (`~5.8`) | Strict type-safety across components and data schemas |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`4.1`) | Next-generation CSS-first configuration via `@theme` |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) (`12.23`) | Physics-based micro-interactions, layout transitions, spring values |
| **Iconography** | [Lucide Icons](https://lucide.dev/) (`lucide-react`) | Crisp, lightweight, tree-shakeable SVG icons |
| **Test Runner** | [Vitest](https://vitest.dev/) (`5.0`) | Fast, native ESM unit and component testing suite |
| **Observer** | [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer) | Viewport triggers for scroll-spy and staggered reveals |

---

## 📂 Project Structure

```
portfolio/
├── src/
│   ├── assets/                       # Static media, icons, and project preview images
│   ├── components/                   # Production UI components
│   │   ├── About/                    # Editorial biography, philosophy & quantified metrics
│   │   ├── AtmosphericBackground/   # Ambient gradient mesh layer
│   │   ├── Contact/                  # Contact ledger, communication channels & direct mail
│   │   ├── CornerBubble/             # Quarter-Circle Bubble architectural card motif
│   │   ├── DossierShell/             # Sticky Dossier Shell (LeftRail, MobileHeader, FloatingDock)
│   │   ├── Experience/               # Executive Ledger career journey & impact tags
│   │   ├── Footer/                   # Architectural colophon & verified credentials
│   │   ├── GlowCard/                 # Editorial Glass Strata card with reactive spring border glow
│   │   ├── Hero/                     # Commanding landing hero with animated typography
│   │   ├── InteractiveBackground/   # 3D Canvas (Isometric Lattice & Hemispherical Dots)
│   │   ├── Projects/                 # Magazine Case Studies & interactive previews
│   │   ├── SectionScaffold/          # Standardized section primitive with descender clearance
│   │   └── Skills/                   # Architectural Toolkit grouped into operational tiers
│   ├── context/                      # Global React context state providers
│   │   ├── PatternContext.tsx        # Background mode state (`cubes` vs `dots`)
│   │   └── ThemeContext.tsx          # Theme provider (light / dark) with persistence
│   ├── data/                         # Decoupled content layer (Single Source of Truth)
│   │   ├── about.ts                  # Bio narrative, engineering philosophy, and stat metrics
│   │   ├── contact.ts                # Contact channels, email, and location metadata
│   │   ├── experience.ts             # Chronological career ledger & quantified metrics
│   │   ├── hero.ts                   # Hero greeting, headline titles, and primary CTA targets
│   │   ├── nav.ts                    # Navigation sections, anchors, and availability status
│   │   ├── projects.ts               # Case studies, problem/solution, tech tags, links
│   │   ├── skills.ts                 # Architectural toolkit tiers & technology taxonomy
│   │   └── social.ts                 # Centralized Social Registry (verified profiles)
│   ├── index.css                     # Global styles & Tailwind v4 `@theme` tokens
│   ├── main.tsx                      # Application root bootstrap
│   └── App.tsx                       # Macro layout composition & section assembly
├── docs/                             # Engineering guidelines and agent domain docs
├── public/                           # Public static assets (favicon, resume PDF)
├── index.html                        # HTML shell with viewport and SEO meta tags
├── package.json                      # Project dependencies, scripts, and engine metadata
├── tsconfig.json                     # TypeScript compiler configuration
└── vite.config.ts                    # Vite configuration with Tailwind CSS v4 plugin
```

---

## ✏️ Maintaining & Customizing Content

> [!IMPORTANT]
> **Maintainer Instruction**: Update all portfolio content inside `src/data/*.ts`.
> Do **not** edit component markup or JSX in `src/components/` to modify textual copy, personal bio, career history, skills, or links. The UI components are decoupled presentation shells that ingest data strictly from the configuration layer.

All portfolio content is centralized and strictly typed in `src/data/`:

| Configuration File | Purpose & Content |
| :--- | :--- |
| **[`src/data/about.ts`](src/data/about.ts)** | Personal bio, engineering philosophy headline and narrative, active focus areas, and milestone metrics. |
| **[`src/data/contact.ts`](src/data/contact.ts)** | Contact prompt, communication channels, location, and verified recipient address. |
| **[`src/data/experience.ts`](src/data/experience.ts)** | Executive Ledger career history, company roles, tenures, impact bullet points, and quantified achievement tags. |
| **[`src/data/hero.ts`](src/data/hero.ts)** | Landing greeting, full name, professional title, and primary/secondary CTA jump targets. |
| **[`src/data/nav.ts`](src/data/nav.ts)** | Navigation section anchors, display names, dock emojis, and developer availability status badge. |
| **[`src/data/projects.ts`](src/data/projects.ts)** | Magazine Case Studies: problem statements, architectural solutions, technology tags, live demo URLs, and GitHub repository links. |
| **[`src/data/skills.ts`](src/data/skills.ts)** | Architectural Stack tiers (*Interface Engine*, *Distributed Systems*, *AI Systems*) and capability badges. |
| **[`src/data/social.ts`](src/data/social.ts)** | Centralized Social Registry: single source of truth for verified profiles (GitHub, LinkedIn, X/Twitter, Email, Resume). |

### Theme & Styling Customization

- **Design System Tokens**: Global styling and font variables are configured via `@theme` in `src/index.css`.
- **Palette**: Colors adhere to the **Precision Cyan** system (`cyan-500`, `sky-500`, `blue-600`, with deep `#050811` dark canvas).
- **Themes**: Light and dark mode support is managed automatically via `ThemeContext.tsx`, applying the `.dark` CSS class to `document.documentElement` and persisting preferences to `localStorage`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/L-Bisht/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Launches the Vite local dev server with instant HMR |
| **Type Check & Build** | `npm run build` | Runs TypeScript compilation (`tsc -b`) and Vite production bundling |
| **Test Suite** | `npm test` | Executes unit and component tests with Vitest |
| **Linting** | `npm run lint` | Runs ESLint across all TypeScript and React source files |
| **Preview** | `npm run preview` | Spins up a local static server to preview the `dist/` production build |

---

## 🧪 Testing

The test suite is powered by **Vitest** and **React Testing Library**, asserting layout integrity, accessibility, physics calculations, and design system constraints:

```bash
# Run tests once
npm test

# Run tests in watch mode
npx vitest

# Run a specific test suite
npx vitest src/components/DossierShell/LeftRail.test.tsx
```

Key test coverage areas:
- `dotMatrixPhysics.test.ts`: Proximity repulsion physics, spring restitution, boundary constraints.
- `LeftRail.test.tsx` & `MobileHeader.test.tsx`: Navigation states, expansion toggle, accessibility, and pattern switcher.
- `SectionScaffold.test.tsx`: Section container rendering, eyebrow lines, and descender compensation.
- `alignment-lock.test.tsx`: Gutter consistency and layout shift verification.
- `palette-purity.test.tsx`: Strict compliance with the Precision Cyan palette.
- `social.test.ts`: Centralized Social Registry URL validation and metadata integrity.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the [MIT License](LICENSE).

---

## 👋 Verified Contact & Profiles

Synchronized with `src/data/social.ts`:

- **Developer**: Lalit Singh Bisht
- **GitHub**: [github.com/l-bisht](https://github.com/l-bisht)
- **LinkedIn**: [lalit-bisht-8b4b82152](https://linkedin.com/in/lalit-bisht-8b4b82152/)
- **X / Twitter**: [@lbisht1996](https://x.com/lbisht1996)
- **Email**: [lbisht1996@gmail.com](mailto:lbisht1996@gmail.com)
- **Resume**: [Download PDF](/resume.pdf)
- **Project Link**: [https://github.com/L-Bisht/portfolio](https://github.com/L-Bisht/portfolio)
