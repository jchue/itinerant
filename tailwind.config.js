const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app.vue",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    boxShadow: {
      sm: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);',
      DEFAULT: '0 0.25rem 1.25rem rgba(0, 0, 0, 0.1);',
      lg: '0 0.25rem 1.75rem rgba(0, 0, 0, 0.15);',
      none: 'none',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      blue: {
        50: '#EBF6FF',
        500: '#006CD0',
        700: '#0055A3',
      },
      emerald: {
        400: '#6C9086',
        500: '#3F6157',
        600: '#304B43',
        700: '#233832',
      },
      gray: {
        100: '#F8FAF8',
        200: '#EDF1ED',
        300: '#D1D8D1',
        400: '#B8BEB8',
        500: '#7F867F',
        600: '#59625F',
        700: '#3E4442',
      },
      green: {
        50: '#EEFAF6',
        500: '#00D092',
        700: '#007753',
      },
      indigo: colors.indigo,
      red: {
        50: '#FFF1F3',
        500: '#D0003E',
        700: '#C1003A',
      },
      white: colors.white,
      yellow: colors.yellow,
    },
    extend: {
      boxShadow: {
        glow: '0 0 1rem rgba(0, 0, 0, 0.3)',
        'glow-lg': '0 0 1.5rem rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
