export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: { extend: {
    fontFamily: { sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'], display: ['Fraunces', 'Georgia', 'serif'] },
    colors: { paper: '#f5f4ef', ink: '#1f2a37', moss: { 50: '#eef6f2', 100: '#d5e9df', 500: '#3b8268', 600: '#2f6f5a', 700: '#255a49' }, night: { 900: '#101614', 800: '#18201d', 700: '#223029' } },
  } },
}
