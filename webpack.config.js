const path = require('path');

module.exports = {
  entry: './js/index.js',
  mode: 'development',
  output: {
    // libraryExport: 'default',
    path: path.resolve(__dirname, '.'),
    filename: 'game.js',
  },
};
