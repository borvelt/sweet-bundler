require('babel-polyfill')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: ['babel-polyfill', './src/app.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {test: /\.(js)$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin(
      {template: __dirname + '/src/index.html', inject: true}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
  ],
  devServer: {
    contentBase: './dist',
    compress: true,
    port: 9000,
    hot: true,
  },
}
