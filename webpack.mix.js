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
  .setPublicPath('lib')
  .babel('src/errors/messageBag.js', 'lib/errors/messageBag.js')
  .babel('src/apiEndpoint.js', 'lib/apiEndpoint.js')
  .babel('src/crudApiEndpoint.js', 'lib/crudApiEndpoint.js')
  .babel('src/crudEndpoint.js', 'lib/crudEndpoint.js')
  .babel('src/endpoint.js', 'lib/endpoint.js')
  .babel('src/index.js', 'lib/index.js')
  .babel('src/resourceApiEndpoint.js', 'lib/resourceApiEndpoint.js')
  .babel('src/resourceEndpoint.js', 'lib/resourceEndpoint.js')
  .webpackConfig({
    externals: {
      // Don't bundle qs
      qs: {
        commonjs: 'qs',
        commonjs2: 'qs',
        amd: 'qs',
        root: 'qs'
      }
    }
  })
