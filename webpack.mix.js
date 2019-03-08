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
  .babel('src/api/apiEndpoint.js', 'lib/api/apiEndpoint.js')
  .babel('src/api/crudApiEndpoint.js', 'lib/api/crudApiEndpoint.js')
  .babel('src/api/resourceApiEndpoint.js', 'lib/api/resourceApiEndpoint.js')
  .babel('src/errors/messageBag.js', 'lib/errors/messageBag.js')
  .babel('src/crudEndpoint.js', 'lib/crudEndpoint.js')
  .babel('src/endpoint.js', 'lib/endpoint.js')
  .babel('src/index.js', 'lib/index.js')
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
