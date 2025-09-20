const {heroui} = require("@heroui/theme");

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@heroui/theme/dist/components/*.js'
  ],
  theme: {
    extend: {
      screens: {
        'max-2xl': { max: '1535px' },
        'max-xl': { max: '1279px' },
        'max-lg': { max: '1023px' },
        'max-md': { max: '767px' },
        'max-sm': { max: '639px' },
        'max-xs': { max: '479px' }
      }
    }
  },
  plugins: [heroui()],
  darkMode: 'class'
}
