module.exports = {
  plugins: [
    require('postcss-import'),  // Importa archivos CSS dentro de otros archivos CSS
    require('tailwindcss'),     // Utiliza Tailwind CSS para estilos rápidos y personalizables
    require('autoprefixer'),    // Agrega prefijos de proveedores CSS automáticamente
    // Configura PurgeCSS para eliminar el CSS no utilizado en producción
    process.env.NODE_ENV === 'production' && require('@fullhuman/postcss-purgecss')({
      content: [
        './src/**/*.html',
        './src/**/*.ts'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};