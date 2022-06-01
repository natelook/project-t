module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Roboto'],
        nouns: ['Londrina Solid'],
      },
      height: {
        '90vh': '90vh',
      },
      colors: {
        'nouns-bg': '#d5d7e1',
      },
      gridTemplateColumns: {
        match: '1fr 50px 1fr',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
