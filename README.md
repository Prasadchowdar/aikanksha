# Aikanksha – Warm Intelligence UI Redesign

## Overview
Aikanksha is a personal branding site for an AI consultant. This repository contains a **React** frontend built with **Create‑React‑App**, **Tailwind CSS**, and modern UI/UX enhancements:

- Editorial Light theme (soft bone background, crisp white sections)
- Subtle 3‑D interactions using `react-parallax-tilt` and `framer‑motion`
- 3‑D flip navigation links for a premium feel
- Spotlight cards that react to cursor‑driven lighting
- Enlarged typography for readability and visual impact

The project demonstrates how to create a high‑end, performance‑friendly web experience without heavy 3‑D engines.

## Features
- **Responsive layout** – works on mobile, tablet, and desktop.
- **Hero section** with tilt‑enabled image and animated entry.
- **Philosophy section** with spotlight‑card grid.
- **Navigation bar** with 3‑D flip hover animation.
- **Tailwind CSS** utility‑first styling and `tailwindcss-animate` for smooth transitions.
- **Framer Motion** for orchestrated scroll‑based animations.

## Getting Started
### Prerequisites
- **Node.js** (v18 or later) and **npm** (or **yarn** if you prefer).
- **Git** for version control.

### Installation
```bash
# Clone the repository
git clone https://github.com/Prasadchowdar/aikanksha.git
cd aikanksha

# Install dependencies (npm is used in the project)
npm install
```

### Development Server
```bash
npm start
```
The app will be available at `http://localhost:3001` (or the port shown in the console).

### Building for Production
```bash
npm run build
```
The optimized static files will be placed in the `build/` directory, ready for deployment to any static‑hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Deploying to GitHub Pages (optional)
```bash
# Make sure the `homepage` field in package.json points to your repo URL
npm run build
npm install -g gh-pages
gh-pages -d build
```

## Project Structure (high‑level)
```
frontend/
├─ src/
│  ├─ components/          # React components (Hero, Navigation, Philosophy, etc.)
│  │   ├─ ui/               # Reusable UI primitives (SpotlightCard, Button, etc.)
│  ├─ index.css            # Tailwind imports, custom utilities, and theme vars
│  └─ index.js             # App entry point
├─ public/                  # Static assets (favicon, images, etc.)
├─ package.json             # Dependencies & scripts
└─ tailwind.config.js      # Tailwind configuration
```

## Contributing
Feel free to open issues or submit pull requests. When contributing:
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/awesome‑feature`).
3. Make your changes and ensure the dev server still compiles.
4. Run `npm run lint` (if configured) and commit.
5. Open a PR against the `main` branch.

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---
*Built with love for a premium, modern web experience.*
