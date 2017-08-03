module.exports = {
  entry: {
    path: './src/main.js'
  },
  output: {
    path: __dirname+'/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './build',
    inline: true
  }
};
