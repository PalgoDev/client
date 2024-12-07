/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "light",
  darkMode: false, // Disable separate dark mode
  daisyui: {
    themes: [
      {
        light: {
          primary: "#0d1b2a",
          "primary-content": "#e0e1dd",
          secondary: "#243b5e", // Slightly lighter than primary
          "secondary-content": "#e0e1dd",
          accent: "#657f9d", // Muted accent
          "accent-content": "#e0e1dd",
          neutral: "#778da9", // Neutral tone
          "neutral-content": "#0d1b2a",
          "base-100": "#e0e1dd", // Background color
          "base-200": "#f4f4f4", // Slightly lighter
          "base-300": "#c5c6c7", // Muted
          "base-content": "#0d1b2a", // Foreground color
          info: "#00a8e8", // Information
          success: "#34eeb6", // Success
          warning: "#ffcf72", // Warning
          error: "#ff8863", // Error
          "--rounded-btn": "9999rem",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        background: "#e0e1dd",
        foreground: "#0d1b2a",
        primary: "#0d1b2a",
        secondary: "#243b5e",
        muted: "#778da9",
        accent: "#657f9d",
        border: "#c5c6c7",
        input: "#c5c6c7",
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
