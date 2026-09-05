const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        promo: path.resolve(__dirname, 'src/promo/index.tsx'),
    },
    output: {
        publicPath: '',
        path: path.resolve(__dirname, 'promo-dist'),
        filename: '[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: { removeViewBox: false },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|otf|eot)$/i,
                type: 'asset/resource',
                generator: { filename: 'assets/[name][ext]' },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        plugins: [
            new TsconfigPathsPlugin({
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/promo/promo.html', to: 'index.html' }],
        }),
    ],
    optimization: {
        minimize: false,
    },
};
