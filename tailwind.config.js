/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        backgroundImage: {
          'auth-pattern': "url('/images/auth-bg.jpg')",
        },
        animation: {
          'float-slow': 'float 6s ease-in-out infinite',
          'float-medium': 'float 5s ease-in-out infinite',
          'float-fast': 'float 4s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          }
        },
      },
    },
    plugins: [],
  };