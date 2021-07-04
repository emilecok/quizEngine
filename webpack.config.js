const path = require('path');

module.exports = {
  entry: './js/index.js',
  context: path.resolve(__dirname, 'app'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    filename: 'game.js',
  },
};
