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
  .js('src/errors/messageBag.js', 'dist/errors/messageBag.js')
  .js('src/apiEndpoint.js', 'dist/apiEndpoint.js')
  .js('src/crudApiEndpoint.js', 'dist/crudApiEndpoint.js')
  .js('src/crudEndpoint.js', 'dist/crudEndpoint.js')
  .js('src/endpoint.js', 'dist/endpoint.js')
  .js('src/index.js', 'dist/index.js')
  .js('src/resourceApiEndpoint.js', 'dist/resourceApiEndpoint.js')
  .js('src/resourceEndpoint.js', 'dist/resourceEndpoint.js')
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
  .sourceMaps()
