const path = require('path');

module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: path.resolve(__dirname, 'src')
            }
        ]

    },
    entry: {
        epris: './src/epris.ts',
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
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};