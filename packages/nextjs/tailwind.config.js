/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("shadcn"), require("tailwindcss-animate")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']", "class"],
  theme: {
  	extend: {
  		boxShadow: {
  			center: '0 0 12px -2px rgb(0 0 0 / 0.05)'
  		},
  		animation: {
  			'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  shadcn: {
    themes: [
      {
        light: {
          primary: "#0D1B2A",
          "primary-content": "#E0E1DD",
          secondary: "#1B263B",
          "secondary-content": "#E0E1DD",
          accent: "#415A77",
          "accent-content": "#E0E1DD",
          neutral: "#778DA9",
          "neutral-content": "#0D1B2A",
          "base-100": "#E0E1DD",
          "base-200": "#F4F4F4",
          "base-300": "#C5C6C7",
          "base-content": "#0D1B2A",
          info: "#00A8E8",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
      {
        dark: {
          primary: "#E0E1DD",
          "primary-content": "#0D1B2A",
          secondary: "#778DA9",
          "secondary-content": "#0D1B2A",
          accent: "#415A77",
          "accent-content": "#0D1B2A",
          neutral: "#1B263B",
          "neutral-content": "#E0E1DD",
          "base-100": "#0D1B2A",
          "base-200": "#1B263B",
          "base-300": "#415A77",
          "base-content": "#E0E1DD",
          info: "#00A8E8",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px", "--tooltip-color": "oklch(var(--p))" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
    ],
  },
};
