/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(24, 100%, 97%)',
          100: 'hsl(24, 100%, 94%)',
          200: 'hsl(24, 100%, 87%)',
          300: 'hsl(24, 100%, 78%)',
          400: 'hsl(24, 100%, 66%)',
          500: 'hsl(24, 95%, 53%)', // Orange-500
          600: 'hsl(24, 94%, 50%)',
          700: 'hsl(24, 96%, 42%)',
          800: 'hsl(24, 96%, 35%)',
          900: 'hsl(24, 96%, 30%)',
        },
        gray: {
          50: 'hsl(210, 20%, 98%)',
          100: 'hsl(220, 14%, 96%)',
          200: 'hsl(220, 13%, 91%)',
          300: 'hsl(216, 12%, 84%)',
          400: 'hsl(218, 11%, 65%)',
          500: 'hsl(220, 9%, 46%)',
          600: 'hsl(215, 14%, 34%)',
          700: 'hsl(217, 19%, 27%)',
          800: 'hsl(215, 28%, 17%)',
          900: 'hsl(221, 39%, 11%)',
        },
        blue: {
          50: 'hsl(214, 100%, 97%)',
          500: 'hsl(217, 91%, 60%)',
          800: 'hsl(217, 91%, 45%)',
          900: 'hsl(217, 91%, 35%)',
        },
        green: {
          500: 'hsl(142, 71%, 45%)',
        },
        purple: {
          500: 'hsl(262, 83%, 58%)',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
