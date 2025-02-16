/** @type {import('tailwindcss').Config} */
module.exports = {
  // Define quais arquivos devem ser processados pelo Tailwind
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}', // Suporte para componentes Tremor
  ],

  // Configuração do tema
  theme: {
    // Configuração do container
    container: {
      center: true, // Centraliza containers
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    
    // Extensões do tema padrão
    extend: {
      // Paleta de cores personalizada
      colors: {
        // Tons de cinza (slate)
        slate: {
          50: 'rgb(248 250 252)',
          100: 'rgb(241 245 249)',
          200: 'rgb(226 232 240)',
          300: 'rgb(203 213 225)',
          400: 'rgb(148 163 184)',
          500: 'rgb(100 116 139)',
          600: 'rgb(71 85 105)',
          700: 'rgb(51 65 85)',
          800: 'rgb(30 41 59)',
          900: 'rgb(15 23 42)',
          950: 'rgb(2 6 23)',
        },
        // Cor primária (azul)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Cores específicas para componentes Tremor
        tremor: {
          brand: {
            faint: '#0ea5e910',
            muted: '#0ea5e930',
            subtle: '#0ea5e960',
            DEFAULT: '#0ea5e9',
            emphasis: '#0284c7',
            inverted: '#ffffff',
          },
          background: {
            muted: '#1e293b',
            subtle: '#0f172a',
            DEFAULT: '#0f172a',
            emphasis: '#f8fafc',
          },
          border: {
            DEFAULT: '#334155',
          },
          ring: {
            DEFAULT: '#94a3b8',
          },
          content: {
            subtle: '#94a3b8',
            DEFAULT: '#e2e8f0',
            emphasis: '#f8fafc',
            strong: '#f8fafc',
            inverted: '#0f172a',
          },
        },
      },
      // Configuração de sombras
      boxShadow: {
        'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      // Configuração de border radius
      borderRadius: {
        'tremor-small': '0.375rem',
        'tremor-default': '0.5rem',
        'tremor-full': '9999px',
      },
      // Configuração de tamanhos de fonte
      fontSize: {
        'tremor-label': ['0.75rem', { lineHeight: '1rem' }],
        'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
        'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
        'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
      },
    },
  },

  // Lista de classes que devem ser preservadas mesmo que não sejam encontradas no conteúdo
  safelist: [
    // Classes de cores dinâmicas para backgrounds
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    // Classes de cores dinâmicas para texto
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    // Classes de cores dinâmicas para bordas
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    // Classes de cores dinâmicas para rings
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    // Classes de cores dinâmicas para strokes
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    // Classes de cores dinâmicas para fills
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],

  // Plugins utilizados
  plugins: [
    require('@tailwindcss/forms'), // Adiciona estilos para formulários
    require('tailwindcss-animate'), // Adiciona classes de animação
  ],
} 