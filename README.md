# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Framer Motion. Features a clean, professional design with smooth animations, dark/light theme support, and fully responsive layout.

[Live Demo](https://l-bisht.github.io/portfolio) | [Report Bug](https://github.com/L-Bisht/portfolio/issues) | [Request Feature](https://github.com/L-Bisht/portfolio/issues)

## ✨ Features

- 🌙 Dark/Light theme with smooth transitions
- 🎨 Modern animations and micro-interactions using Framer Motion
- 📱 Fully responsive design for all devices
- ⚡ Optimized performance with Vite
- 🎯 Type-safe development with TypeScript
- 🎨 Modern styling with Tailwind CSS
- 🔄 Smooth scrolling and section transitions
- 📊 Dynamic content rendering
- 🎉 Interactive UI elements and hover effects

## 🛠️ Built With

- **Frontend Framework**: [React 19](https://react.dev/)
- **Type System**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Hero Icons](https://heroicons.com/)
- **Deployment**: [GitHub Pages](https://pages.github.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

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

4. Open [http://localhost:5173](http://localhost:5173) to view it in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── About/          # About section component
│   ├── Contact/        # Contact form component
│   ├── Footer/         # Footer component
│   ├── Hero/           # Hero/landing section
│   ├── Navbar/         # Navigation bar
│   ├── Projects/       # Projects showcase
│   ├── Skills/         # Skills section
│   └── ThemeToggle/    # Theme switcher
├── contexts/           # React contexts
│   ├── theme-context-types.ts    # Theme context types
│   ├── theme-context.tsx         # Theme provider
│   └── useTheme.ts              # Theme hook
├── assets/            # Static assets
├── App.tsx           # Main app component
├── index.css         # Global styles
└── main.tsx         # Entry point
```

## 🎨 Customization

### Themes

The website supports light and dark themes. Theme preferences are automatically saved to localStorage.

### Content

Update the content in the respective component files:

- Update bio in `About/About.tsx`
- Add projects in `Projects/Projects.tsx`
- Modify skills in `Skills/Skills.tsx`
- Update contact info in `Contact/Contact.tsx`

### Styling

- Global styles are in `index.css`
- Component-specific styles use Tailwind classes
- Theme colors can be customized in `tailwind.config.js`

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👋 Contact

Lalit Singh Bisht - [@your_twitter](https://twitter.com/your_twitter) - lbisht1996@gmail.com

Project Link: [https://github.com/L-Bisht/portfolio](https://github.com/L-Bisht/portfolio)

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Hero Icons](https://heroicons.com/)
