const mix = require('laravel-mix')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .setResourceRoot('src')
  .setPublicPath('dist')
  .js('src/index.js', 'dist/index.js')

mix.webpackConfig({
  output: {
    library: 'resource-endpoint',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
})
