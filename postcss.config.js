export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      grid: true,
      flexbox: 'no-2009',
    },
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: 'default',
      },
    }),
  },
}
