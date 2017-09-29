var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
      },
      {
        test: /\.css$/, 
        use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' }
        ]
      }
    ]
  },
  devtool: 'cheap-source-map'
};