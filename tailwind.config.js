/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Anything clickable - buttons, anchors, etc.
        link: {
          DEFAULT: '#646cff',
          hover: '#5056CC',
          dark: '#747bff', // Dark mode variant
        },
        text: {
          DEFAULT: '#213547',
          dark: 'rgba(255, 255, 255, 0.87)',
        },
        background: {
          DEFAULT: '#f2f2f2',
          dark: '#242424',
        },
        overlay: {
          DEFAULT: '#f8f8f8',
          dark: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': '3.2rem', // For your h1 size
      },
      borderRadius: {
        'button': '8px', // Your button border radius
      },
      spacing: {
        'button-x': '1.2em',
        'button-y': '0.6em',
        'input-x': '0.5rem',
        'input-y': '0.5rem',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}