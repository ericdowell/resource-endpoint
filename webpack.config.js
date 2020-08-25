const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: {
    'resource-endpoint': path.resolve(__dirname, 'src/resource-endpoint.ts'),
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js(x?)$/,
        loader: 'source-map-loader',
      },
    ],
  },
  externals: {
    axios: {
      commonjs: 'axios',
      commonjs2: 'axios',
      amd: 'axios',
      root: 'axios',
    },
    qs: {
      commonjs: 'qs',
      commonjs2: 'qs',
      amd: 'qs',
      root: 'qs',
    },
    'url-join': {
      commonjs: 'url-join',
      commonjs2: 'url-join',
      amd: 'url-join',
      root: 'url-join',
    },
  },
}
