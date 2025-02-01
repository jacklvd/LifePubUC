import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      colors: {
        customgreys: {
          primarybg: "#1B1C22",
          secondarybg: "#25262F",
          darkGrey: "#17181D",
          darkerGrey: "#3d3d3d",
          dirtyGrey: "#6e6e6e",
        },
        primary: {
          "50": "#CAE9FF", 
          "100": "#BEE9E8", 
          "200": "#62B6CB", 
          "300": "#5FA8D3", 
          "400": "#5FA8D3", 
          "500": "#1B4965", 
          "600": "#1B4965", 
          "700": "#1B4965", 
          "800": "#1B4965", 
          "900": "#0D2532", 
          "950": "#071319", 
          DEFAULT: "#1B4965", // Using the dark blue as default
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "50": "#F5FAFA", 
          "100": "#CAE9FF", 
          "200": "#BEE9E8", 
          "300": "#62B6CB", 
          "400": "#5FA8D3", 
          "500": "#5FA8D3", 
          "600": "#1B4965", 
          "700": "#1B4965", 
          "800": "#0D2532", 
          "900": "#071319", 
          "950": "#040C0F", 
          DEFAULT: "#62B6CB",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#5FA8D3", 
         
        },
        
        palette: {
          lightest: "#BEE9E8", 
          light: "#62B6CB", 
          medium: "#1B4965", 
          pale: "#CAE9FF", 
          blue: "#5FA8D3", 
        },
        white: {
          "50": "#d2d2d2",
          "100": "#ffffff",
        },
        tertiary: {
          "50": "#E9B306",
        },
       
      },
    
    
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
      },
      fontSize: {
        xs: [
          "0.75rem",
          {
            lineHeight: "1rem",
          },
        ],
        sm: [
          "0.875rem",
          {
            lineHeight: "1.25rem",
          },
        ],
        md: [
          "1rem",
          {
            lineHeight: "1.5rem",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.75rem",
          },
        ],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.75rem",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "2rem",
          },
        ],
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
    "prettier-plugin-tailwindcss",
  ],
} satisfies Config;

export default config;
