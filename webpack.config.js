const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'engine.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: false,
    port: 55555,
  },
};
