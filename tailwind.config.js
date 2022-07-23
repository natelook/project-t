module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
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
        gray: {
          DEFAULT: '#6C757D',
          100: '#F8F9FA',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#B5B5B8',
          600: '#6C757D',
          700: '#272932',
          800: '#1F2028',
          900: '#1C1D23',
        },
        dark: {
          bg: '#1C1D23',
        },
        primary: {
          DEFAULT: '#5733F5',
          lighter: '#6847F6',
          opaque: 'rgba(87,51,245,.5)',
        },
        secondary: '#6847F6',
        blue: '#004ACB',
        success: '#1CF463',
        warning: '#FFC107',
        danger: '#FF3500',
      },
      gridTemplateColumns: {
        match: '1fr 50px 1fr',
      },
      // backgroundImage: {
      //   confetti:
      //     "url('/colorful-confetti-falling-illustration-isolated-on-transparent-background-event-and-anniversary-celebration-blue-red-yellow-tinsel-falling-carnival-elements-simple-colorful-confetti-falling-vector2.png')",
      // },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
