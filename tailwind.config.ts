
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Lexend Deca', 'sans-serif'],
				mono: ['Inconsolata', 'monospace'],
				heading: ['Lexend Deca', 'sans-serif'],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
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
			},
			lineClamp: {
				7: '7',
				8: '8',
				9: '9',
				10: '10',
			},
			spacing: {
				'header': '4.5rem',
				'container': '1.5rem',
				'section': '2rem',
				'card': '1.25rem',
				'grid': '1.5rem'
			},
			typography: {
				'heading-xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
				'heading-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
				'heading-md': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
				'heading-sm': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
				'body-lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
				'body-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
				'body-sm': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
