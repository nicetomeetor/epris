const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        epris: './src/epris.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Epris',
        libraryTarget: 'window',
        libraryExport: 'default'
    },
};