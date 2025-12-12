import {heroui} from "@heroui/theme"

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
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        // light: {
        //   colors: {
        //     secondary: {
        //       DEFAULT: "#BEF264",
        //       foreground: "#BEF264",
        //       50: "#F7FBD9",
        //       100: "#EFF7B3",
        //       200: "#E0F285",
        //       300: "#D1EE57",
        //       400: "#C3EA2A",
        //       500: "#B5E600",
        //       600: "#92B300",
        //       700: "#6E8000",
        //       800: "#4B4D00",
        //       900: "#272600",
        //     },
        //     focus: "#BEF264",
        //   },
        // },
      },
    }),
  ],
}
