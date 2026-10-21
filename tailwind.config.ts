import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand palette
        ember: {
          50: '#fff4f0',
          100: '#ffe0d0',
          200: '#ffb999',
          300: '#ff8a55',
          400: '#FF6A00',
          500: '#E5261A',
          600: '#cc1f15',
          700: '#a81610',
          800: '#88100a',
          900: '#6b0807',
        },
        amber: {
          glow: '#FFB020',
        },
        // Dark backgrounds
        void: {
          950: '#0a0a0c',
          900: '#111114',
          800: '#1a1a1f',
          700: '#222228',
          600: '#2a2a32',
          500: '#35353f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'ember-float': 'emberFloat 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'counter': 'counter 2s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(229,38,26,0.4), 0 0 40px rgba(255,106,0,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(229,38,26,0.8), 0 0 80px rgba(255,106,0,0.4)' },
        },
        emberFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)', opacity: '0.6' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backgroundImage: {
        'ember-gradient': 'linear-gradient(135deg, #E5261A 0%, #FF6A00 50%, #FFB020 100%)',
        'void-gradient': 'linear-gradient(180deg, #0a0a0c 0%, #111114 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'ember-sm': '0 0 10px rgba(229,38,26,0.3)',
        'ember-md': '0 0 20px rgba(229,38,26,0.5), 0 0 40px rgba(255,106,0,0.2)',
        'ember-lg': '0 0 40px rgba(229,38,26,0.7), 0 0 80px rgba(255,106,0,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}

export default config
