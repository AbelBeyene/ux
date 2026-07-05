import type { Config } from "tailwindcss";

/**
 * Design tokens follow Material 3 naming (surface/primary/secondary roles)
 * plus a small set of product-specific aliases (text-main, accent-hover…).
 * Components reference tokens only — never raw hex values — so the whole
 * system can be re-themed from this single file.
 */
const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "outline-variant": "#c3c7cd",
        "surface-container": "#ebeeef",
        "secondary-fixed-dim": "#ffb599",
        background: "#f7fafb",
        "on-primary-fixed": "#001d33",
        "on-primary": "#ffffff",
        "text-main": "#122E45",
        "surface-tint": "#47617a",
        "inverse-on-surface": "#eef1f2",
        "on-secondary-container": "#4f1700",
        error: "#ba1a1a",
        "surface-variant": "#e0e3e4",
        "on-tertiary-container": "#b28d5f",
        "on-tertiary-fixed": "#2a1800",
        "on-background": "#181c1d",
        "secondary-container": "#fc5b00",
        "secondary-fixed": "#ffdbce",
        "surface-dim": "#d7dadb",
        "on-error-container": "#93000a",
        "tertiary-container": "#3f2703",
        "surface-container-low": "#f1f4f5",
        "surface-container-high": "#e6e9ea",
        "inverse-surface": "#2d3132",
        outline: "#73777d",
        "accent-hover": "#E65300",
        "on-secondary-fixed": "#370e00",
        "surface-bright": "#f7fafb",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed": "#ffddb6",
        "error-container": "#ffdad6",
        primary: "#00192d",
        "on-primary-fixed-variant": "#2f4961",
        tertiary: "#241400",
        "on-secondary": "#ffffff",
        "tertiary-fixed-dim": "#e9c08e",
        "primary-fixed": "#cee5ff",
        secondary: "#f26522",
        "surface-container-highest": "#e0e3e4",
        "inverse-primary": "#afc9e6",
        "on-primary-container": "#7c96b1",
        "on-surface-variant": "#43474d",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed-variant": "#5d411b",
        "background-alt": "#F8FAFB",
        "on-error": "#ffffff",
        surface: "#f7fafb",
        "primary-fixed-dim": "#afc9e6",
        "on-secondary-fixed-variant": "#802a00",
        "on-surface": "#181c1d",
        "surface-white": "#FFFFFF",
        "primary-container": "#122e45",
        "text-muted": "#5C6F7E",
        // "Paper world": the resume document renders on warm stock, distinct
        // from the cool app chrome around it.
        paper: "#FFFDF7",
        "paper-line": "#EDE7DA",
      },
      boxShadow: {
        // A sheet resting on the desk: tight contact shadow + soft ambient.
        paper:
          "0 1px 2px rgba(18, 46, 69, 0.07), 0 12px 32px -12px rgba(18, 46, 69, 0.22)",
        card: "0 1px 2px rgba(18, 46, 69, 0.05), 0 4px 16px -8px rgba(18, 46, 69, 0.1)",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        "margin-desktop": "40px",
        "stack-sm": "8px",
        "stack-lg": "32px",
        gutter: "24px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "stack-md": "16px",
      },
      fontFamily: {
        sans: ["'Hanken Grotesk'", "system-ui", "sans-serif"],
        // Display serif for verdict moments (scores, grades) and the resume
        // document itself — the product's material is the typeset page.
        display: ["'Fraunces'", "Georgia", "serif"],
      },
      // Type scale aligned to Material Design 3 (m3.material.io/styles/typography):
      // body-md = M3 body-medium, headline-md = M3 title-medium,
      // headline-lg = M3 headline-small, labels = M3 label-small/medium.
      fontSize: {
        "headline-lg-mobile": ["22px", { lineHeight: "28px", fontWeight: "700" }],
        "label-xs": ["10px", { lineHeight: "14px", letterSpacing: "0.5px", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.5px", fontWeight: "500" }],
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.5px", fontWeight: "600" }],
        "headline-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        // Chrome-level page title (TopBar) — sits between headline-md and
        // headline-lg, set in the display serif rather than the body sans.
        "headline-sm": ["18px", { lineHeight: "24px" }],
        // Brand wordmark size, shared by Sidebar and the auth screens.
        brand: ["22px", { lineHeight: "28px" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "display-lg": ["52px", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "550" }],
        "display-md": ["30px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "550" }],
      },
      keyframes: {
        "fade-rise": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "fade-rise": "fade-rise 0.5s cubic-bezier(0.2, 0.7, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
