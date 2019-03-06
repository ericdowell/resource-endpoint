const mix = require('laravel-mix')
const path = require('path')

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
  .babel('src/errors/messageBag.js', 'dist/errors/messageBag.js')
  .babel('src/apiEndpoint.js', 'dist/apiEndpoint.js')
  .babel('src/crudApiEndpoint.js', 'dist/crudApiEndpoint.js')
  .babel('src/crudEndpoint.js', 'dist/crudEndpoint.js')
  .babel('src/endpoint.js', 'dist/endpoint.js')
  .babel('src/index.js', 'dist/index.js')
  .babel('src/resourceApiEndpoint.js', 'dist/resourceApiEndpoint.js')
  .babel('src/resourceEndpoint.js', 'dist/resourceEndpoint.js')
