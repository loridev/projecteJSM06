const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        polyfill: ['babel-polyfill'],
        index: './src/js/index.js',
        teams: './src/js/teams.js',
        myteam: './src/js/myteam.js',
    },
    output: {
        path: path.resolve(process.cwd(), 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'myteam.html',
            template: './src/myteam.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'teams.html',
            template: './src/teams.html',
        }),
    ],
    devServer: {
        static: './dist',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};