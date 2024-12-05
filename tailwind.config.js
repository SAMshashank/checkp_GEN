module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './common/**/*.{js,ts,jsx,tsx}',
    './modules/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', 'class'],
  theme: {
  	fontSize: {
  		xs: '0.75rem',
  		sm: '0.875rem',
  		base: '1rem',
  		lg: '1.125rem',
  		xl: '1.25rem',
  		'2xl': '1.5rem',
  		'3xl': '1.875rem',
  		'4xl': '2.25rem',
  		'5xl': '3rem',
  		'6xl': '4rem',
  		extra: '6rem'
  	},
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",

	 // Custom breakpoint for iPhone SE screen size
	
		},
	  },
  	extend: {
		screens: {
			'iphone-se': { max: '420px' }, // Custom breakpoint for iPhone SE screen size
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
  			},
			  border: "hsl(var(--border))",
			  input: "hsl(var(--input))",
			  ring: "hsl(var(--ring))",
			  background: "hsl(var(--background))",
			  foreground: "hsl(var(--foreground))",
			  primary: {
				DEFAULT: "hsl(var(--primary))",
				foreground: "hsl(var(--primary-foreground))",
			  },
			  secondary: {
				DEFAULT: "hsl(var(--secondary))",
				foreground: "hsl(var(--secondary-foreground))",
			  },
			  destructive: {
				DEFAULT: "hsl(var(--destructive))",
				foreground: "hsl(var(--destructive-foreground))",
			  },
			  muted: {
				DEFAULT: "hsl(var(--muted))",
				foreground: "hsl(var(--muted-foreground))",
			  },
			  accent: {
				DEFAULT: "hsl(var(--accent))",
				foreground: "hsl(var(--accent-foreground))",
			  },
			  popover: {
				DEFAULT: "hsl(var(--popover))",
				foreground: "hsl(var(--popover-foreground))",
			  },
			  card: {
				DEFAULT: "hsl(var(--card))",
				foreground: "hsl(var(--card-foreground))",
			  },
  		},
  		width: {
  			'160': '40rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		  keyframes: {
			"accordion-down": {
			  from: { height: 0 },
			  to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
			  from: { height: "var(--radix-accordion-content-height)" },
			  to: { height: 0 },
			},
		  },
		  animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
		  },
  	},
  	fontFamily: {
  		montserrat: ['Montserrat', 'sans-serif']
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
