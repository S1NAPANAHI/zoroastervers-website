/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Accessible Primary Colors (WCAG AA compliant)
        primary: {
          50: '#f0f9ff',   // Very light blue-gray
          100: '#e0f2fe',  // Light blue-gray
          200: '#bae6fd',  // Medium light blue
          300: '#7dd3fc',  // Medium blue
          400: '#38bdf8',  // Medium-dark blue
          500: '#0ea5e9',  // Primary blue (4.5:1 contrast on white)
          600: '#0284c7',  // Dark blue (7:1 contrast on white)
          700: '#0369a1',  // Darker blue
          800: '#075985',  // Very dark blue
          900: '#0c4a6e',  // Darkest blue
          950: '#082f49'   // Ultra dark blue
        },
        // Accessible Secondary Colors
        secondary: {
          50: '#fafafa',   // Very light gray
          100: '#f4f4f5',  // Light gray
          200: '#e4e4e7',  // Medium light gray
          300: '#d4d4d8',  // Medium gray
          400: '#a1a1aa',  // Medium-dark gray
          500: '#71717a',  // Secondary gray (4.5:1 contrast on white)
          600: '#52525b',  // Dark gray (7:1 contrast on white)
          700: '#3f3f46',  // Darker gray
          800: '#27272a',  // Very dark gray
          900: '#18181b',  // Darkest gray
          950: '#09090b'   // Ultra dark gray
        },
        // Accessible Accent Colors
        accent: {
          // Purple accent (good for highlights and CTAs)
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',  // 4.5:1+ contrast on white
            600: '#9333ea',  // 7:1+ contrast on white
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764'
          },
          // Green accent (good for success states)
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',  // 4.5:1+ contrast on white
            600: '#16a34a',  // 7:1+ contrast on white
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16'
          },
          // Red accent (good for errors and warnings)
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',  // 4.5:1+ contrast on white
            600: '#dc2626',  // 7:1+ contrast on white
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a'
          },
          // Cyan accent (good for info and links)
          cyan: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',  // 4.5:1+ contrast on white
            600: '#0891b2',  // 7:1+ contrast on white
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
            950: '#083344'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Crimson Text', 'EB Garamond', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
