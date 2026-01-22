/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: { brand: '#22d3ee', accent: '#a78bfa' },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#22d3ee',
          secondary: '#a78bfa',
          accent: '#a78bfa',
          'base-100': '#1d232a',
        },
      },
      "light"
    ],
    darkTheme: 'dark',
  },
};


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{html,ts}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [require("daisyui")],
//   daisyui: {
//     themes: ["dark", "light"],
//     darkTheme: "dark",
//   },
// };

