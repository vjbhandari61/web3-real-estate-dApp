module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A',
        secondary: '#1A1A1A',
        accent: '#FFD700',
        text: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'cinematic-gradient': 'linear-gradient(to bottom, rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.7))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};