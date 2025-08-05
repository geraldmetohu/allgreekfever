import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import aspectRatio from "@tailwindcss/aspect-ratio";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        scrollX: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        bounceX: {
          "0%, 100%": { transform: "translateX(0%)" },
          "50%": { transform: "translateX(-50%)" },
        },
        bounceXOnce: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(30vw)" },
        },
      },
      animation: {
        beat: "beat 1.5s ease-in-out 1",
        scrollX: "scrollX 30s linear infinite",
        bounceX: "bounceX 6s ease-in-out infinite",
        bounceXOnce: "bounceXOnce 6s ease-in-out infinite",
      },
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        chart: {
          "1": "rgb(var(--chart-1))",
          "2": "rgb(var(--chart-2))",
          "3": "rgb(var(--chart-3))",
          "4": "rgb(var(--chart-4))",
          "5": "rgb(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate, aspectRatio],
};

export default config;
