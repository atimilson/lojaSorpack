/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais baseadas no degradê amarelo da logo
        primary: '#F9B040', // Amarelo mais claro
        'primary-dark': '#F09B08', // Amarelo mais escuro
        
        // Azul escuro da logo
        secondary: '#1C1961', 
        'secondary-light': '#2A277D', // Versão mais clara do azul
        'secondary-dark': '#13124A', // Versão mais escura do azul
        
        // Cores complementares
        accent: '#CD2A1E', // Vermelho como cor de destaque
        
        // Tons neutros
        neutral: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#919191',
          600: '#6d6d6d',
          700: '#4f4f4f',
          800: '#333333',
          900: '#1a1a1a',
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide")
  ],
}; 