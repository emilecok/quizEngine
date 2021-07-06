const path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/index.js',
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: 'engine.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'app'),
    compress: false,
    port: 55555,
  },
};
