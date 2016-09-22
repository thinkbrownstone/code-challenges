const HtmlWebpackPlugin = require('html-webpack-plugin');
const join = require('path').join;
const webpack = require('webpack');

module.exports = {
  context: join(__dirname, '/src'),
  entry: './index.js',

  output: {
    filename: './index.[hash].js',
    path: join(__dirname, '/dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      filename: 'index.html',
    }),
  ],
  devtool: 'inline-source-map',
  module: {
    preLoaders: [
       { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ },
    ],
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loaders: ['babel'],
    },
    {
      test: /\.css?$/,
      loader: 'style!css',
    },
    {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      loader: 'file-loader',
    },
    {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192',
    }],
  },
};
