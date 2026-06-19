import type { Config } from 'tailwindcss'

/**
 * Tokens visuais do Mystery Gifter — espelham estritamente o DESIGN.md.
 *
 * Convenção:
 *  - Todos os tokens customizados ficam sob o namespace `mg` (cores, sombras,
 *    radii) para evitar colisão com tokens nativos do Tailwind (FR-007).
 *  - Cores hardcoded fora deste arquivo e de `globals.css` são proibidas (FR-006).
 *  - O verde `mg-green` (#1ed760) é funcional: usar somente em CTAs, estado
 *    ativo de navegação e botões de ação principal (FR-008).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mg: {
          // Backgrounds e superfícies (depth via shade variation)
          bg: '#121212',
          surface: '#181818',
          'surface-2': '#1f1f1f',
          'surface-3': '#252525',
          'surface-4': '#272727',

          // Brand accent — funcional, nunca decorativo
          green: '#1ed760',
          'green-border': '#1db954',

          // Tipografia
          text: '#ffffff',
          'text-muted': '#b3b3b3',
          'text-near-white': '#cbcbcb',
          'text-light': '#fdfdfd',

          // Semânticos (DESIGN.md §2)
          'text-negative': '#f3727f',
          'text-warning': '#ffa42b',
          'text-announcement': '#539df5',

          // Bordas
          border: '#4d4d4d',
          'border-light': '#7c7c7c',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-manrope)',
          'var(--font-noto-sans)',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        title: [
          'var(--font-manrope)',
          'var(--font-noto-sans)',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      letterSpacing: {
        // ≈ 1.4–2px para rótulos de botão em uppercase (FR-010)
        btn: '0.1em',
      },
      borderRadius: {
        // Geometria pill/circular obrigatória em botões (FR-009)
        pill: '9999px',
        'pill-lg': '500px',
        card: '8px',
        'card-sm': '6px',
      },
      boxShadow: {
        // Níveis de elevação do DESIGN.md §6
        'mg-card': 'rgba(0, 0, 0, 0.3) 0px 8px 8px',
        'mg-dialog': 'rgba(0, 0, 0, 0.5) 0px 8px 24px',
        'mg-inset':
          'rgb(18, 18, 18) 0px 1px 0px, rgb(124, 124, 124) 0px 0px 0px 1px inset',
      },
      maxWidth: {
        // Container app-like em desktop (PR-007 + FR-022)
        app: '480px',
      },
      keyframes: {
        // Animação de revelação: fade + leve spring para momentos de destaque
        reveal: {
          from: { opacity: '0', transform: 'scale(0.88) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        // cubic-bezier com leve overshoot (spring) — tátil e responsivo
        reveal: 'reveal 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
}

export default config
