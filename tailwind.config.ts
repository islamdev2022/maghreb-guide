import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                maghreb: {
                    primary: "#C84B31", // Deep terracotta/ochre
                    primaryLight: "#D97757",
                    secondary: "#2D46B9", // Majorelle/Mediterranean Blue
                    secondaryDark: "#1E3A8A",
                    sand: "#F5F0E6", // warm background
                    medina: "#FAF8F5", // off-white
                    olive: "#6B705C", // Nature/Oases
                    gold: "#D4AF37", // Warm gold
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"], // Assuming Playfair Display will be added
            },
            borderRadius: {
                moorish: "3rem 3rem 0.5rem 0.5rem", // "Moorish arch" heavy top, less bottom
            },
            boxShadow: {
                warm: "0 10px 40px -10px rgba(200, 75, 49, 0.15)", // soft terracotta shadow
                glass: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [],
};
export default config;
