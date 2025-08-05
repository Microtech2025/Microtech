/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1e40af', // Deep institutional blue (blue-700)
        'primary-50': '#eff6ff', // Very light blue (blue-50)
        'primary-100': '#dbeafe', // Light blue (blue-100)
        'primary-200': '#bfdbfe', // Lighter blue (blue-200)
        'primary-500': '#3b82f6', // Medium blue (blue-500)
        'primary-600': '#2563eb', // Darker blue (blue-600)
        'primary-800': '#1e3a8a', // Very dark blue (blue-800)
        'primary-900': '#1e40af', // Darkest blue (blue-900)

        // Secondary Colors
        'secondary': '#059669', // Success-oriented green (emerald-600)
        'secondary-50': '#ecfdf5', // Very light green (emerald-50)
        'secondary-100': '#d1fae5', // Light green (emerald-100)
        'secondary-500': '#10b981', // Medium green (emerald-500)
        'secondary-600': '#059669', // Darker green (emerald-600)

        // Accent Colors
        'accent': '#d97706', // Warm amber (amber-600)
        'accent-50': '#fffbeb', // Very light amber (amber-50)
        'accent-100': '#fef3c7', // Light amber (amber-100)
        'accent-500': '#f59e0b', // Medium amber (amber-500)
        'accent-600': '#d97706', // Darker amber (amber-600)

        // Background Colors
        'background': '#f8fafc', // Soft neutral (slate-50)
        'surface': '#ffffff', // Pure white (white)

        // Text Colors
        'text-primary': '#1f2937', // Near-black (gray-800)
        'text-secondary': '#6b7280', // Medium gray (gray-500)
        'text-muted': '#9ca3af', // Light gray (gray-400)

        // Status Colors
        'success': '#10b981', // Vibrant green (emerald-500)
        'success-50': '#ecfdf5', // Very light green (emerald-50)
        'success-100': '#d1fae5', // Light green (emerald-100)

        'warning': '#f59e0b', // Attention-grabbing orange (amber-500)
        'warning-50': '#fffbeb', // Very light amber (amber-50)
        'warning-100': '#fef3c7', // Light amber (amber-100)

        'error': '#ef4444', // Clear red (red-500)
        'error-50': '#fef2f2', // Very light red (red-50)
        'error-100': '#fee2e2', // Light red (red-100)

        // Border Colors
        'border': '#e5e7eb', // Light gray border (gray-200)
        'border-light': '#f3f4f6', // Very light gray border (gray-100)
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '1000': '1000',
        '1100': '1100',
        '1200': '1200',
      },
    },
  },
  plugins: [],
}