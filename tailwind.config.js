export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: '#0a0a0a',
        panel: '#111111',
        panel2: '#161616',
        panel3: '#1a1a1a',
        text: '#e8e8e8',
        muted: '#888888',
        accent: '#4ade80',
      },
    },
  },
};
