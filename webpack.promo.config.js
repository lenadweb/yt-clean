const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env = {}) => {
    const isDevelopment = Boolean(env.development);

    return {
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'eval-cheap-module-source-map' : false,
        entry: {
            promo: path.resolve(__dirname, 'src/promo/index.tsx'),
        },
        output: {
            publicPath: isDevelopment ? '/' : '',
            path: path.resolve(__dirname, 'promo-dist'),
            filename: '[name].js',
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: { transpileOnly: isDevelopment },
                    },
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
                                                overrides: {
                                                    removeViewBox: false,
                                                },
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
                    test: /\.(png|jpe?g|webp)$/i,
                    type: 'asset/resource',
                    generator: { filename: 'assets/[name][ext]' },
                },
                {
                    test: /\.(woff(2)?|ttf|otf|eot)$/i,
                    type: 'asset/inline',
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
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/promo/promo.html'),
                filename: 'index.html',
                inject: 'body',
            }),
        ],
        optimization: {
            minimize: false,
        },
        devServer: {
            static: false,
            hot: true,
            port: 4400,
            open: true,
            client: { overlay: true },
        },
    };
};
