import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	extend: {
		colors: {
			primary: {
				'50': ' #F6F8FD',
				'500': '#00aa8a',
				'600': '#00b0b5'
			},
			teal: {
                '50': '#f0fdfa',
                '100': '#ccfbf1',
                '200': '#99f6e4',
                '300': '#5eead4',
                '400': '#2dd4bf',
                '500': '#14b8a6',
                '600': '#0d9488',
                '700': '#0f766e',
                '800': '#115e59',
                '900': '#134e4a',
                '950': '#042f2e',
            },
			yellow: {
                '50': '#fefce8',
                '100': '#fef9c3',
                '200': '#fef08a',
                '300': '#fde047',
                '400': '#facc15',
                '500': '#eab308',
                '600': '#ca8a04',
                '700': '#a16207',
                '800': '#854d0e',
                '900': '#713f12',
                '950': '#422006',
            },
			coral: {
				'500': '#15BF59'
			},
			grey: {
				'50': '#F6F6F6',
				'400': '#AFAFAF',
				'500': '#757575',
				'600': '#545454'
			},
			black: '#000000',
			white: '#FFFFFF',
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			foreground: 'hsl(var(--foreground))',
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			}
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		fontFamily: {
			poppins: ['var(--font-poppins)']
		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out'
		}
	}
},
  plugins: [require("tailwindcss-animate")],
};
export default config;
