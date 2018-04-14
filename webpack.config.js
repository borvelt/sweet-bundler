require('babel-polyfill')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: ['babel-polyfill', './src/app.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      loader: 'babel-loader',
      exclude: function (modulePath) {
        return /node_modules/.test(modulePath) &&
          !/node_modules\/vue-particles/.test(modulePath)
      },
      options: Object.assign({}, this.babelOptions),
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
        options: {},
      }, {
        loader: 'css-loader',
        options: {},
      }],
    }, {
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
      },
    }],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'es2018-boilerplate',
      template: __dirname + '/src/index.html',
      inject: true,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
    (process.env === 'production') ? new UglifyJsPlugin() : () => {},
  ],
  resolve: {
    alias: {},
  },
  devServer: {
    stats: {
      colors: true,
    },
    // clientLogLevel: 'none',
    // quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    contentBase: './dist',
    compress: false,
    port: 9000,
    hot: true,
  },
}