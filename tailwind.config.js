import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        // [size, { lineHeight }]  — Major Third scale (1.250)
        xs:   ['0.75rem',  { lineHeight: '1rem' }],     // 12 / 16  → timestamps, badges, fine print
        sm:   ['0.875rem', { lineHeight: '1.25rem' }],  // 14 / 20  → captions, metadata, chip labels
        base: ['1rem',     { lineHeight: '1.5rem' }],   // 16 / 24  → body text (default)
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],  // 18 / 28  → lead paragraphs, card descriptions
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],  // 20 / 28  → card titles, sidebar headings
        '2xl':['1.5rem',   { lineHeight: '2rem' }],     // 24 / 32  → h3, section subtitles
        '3xl':['1.875rem', { lineHeight: '2.25rem' }],  // 30 / 36  → h2, section titles
        '4xl':['2.25rem',  { lineHeight: '2.5rem' }],   // 36 / 40  → h1, page titles
        '5xl':['3rem',     { lineHeight: '1.1' }],      // 48       → hero headlines (desktop)
        '6xl':['3.75rem',  { lineHeight: '1.05' }],     // 60       → big hero / poster mode
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: { colors: { 
          background: "#eff6ff",
          primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        } },
        dark: { colors: { 
          background: "#000000",
          primary: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
            950: "#451a03",
            DEFAULT: "#f59e0b",
            foreground: "#000000",
          },
        } },
      }
    }),
  ],
}
