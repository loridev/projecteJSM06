const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
            chunks: ['polyfill', 'index'],
        }),
        new HtmlWebpackPlugin({
            filename: 'myteam.html',
            template: './src/myteam.html',
            chunks: ['polyfill', 'myteam'],
        }),
        new HtmlWebpackPlugin({
            filename: 'teams.html',
            template: './src/teams.html',
            chunks: ['polyfill', 'teams'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    to: 'style.css',
                    from: './src/css/style.css',
                },
            ],
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