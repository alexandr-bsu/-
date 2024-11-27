/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "corp-white": "#D1D8E2",
      green: "#155d5e",
      "dark-green": "#204b4a",
      cream: "#d9b08c",
      black: "#222222",
      white: "#ffffff",
      gray: "#d7d7d7",
      "gray-disabled": "#a5a5a5",
      red: "#e72222",
    },
    extend: {
      screens: {
        xs: "500px",
        "tilda-xl": "960px",
        "tilda-l": "780px",
        "tilda-m": "728px",
        "tilda-s": "385px",
        "tilda-xs": "320px",
        "tilda-680": "680px",
        "tilda-895": "895px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@vidstack/react/tailwind.cjs")({
      // Optimize output by specifying player selector.
      selector: ".media-player",
      // Change the media variants prefix.
      prefix: "media",
    }),
  ],
};
