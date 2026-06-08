const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CSSBuilderPlugin = require('./cssBuilder');
const { version } = require('./package.json');

module.exports = (env) => ({
    mode: env?.development ? 'development' : 'production',
    entry: {
        worker: `${__dirname}/src/worker/index.ts`,
        sidebar: `${__dirname}/src/sidebar/index.tsx`,
        content: `${__dirname}/src/content/index.ts`,
    },
    output: {
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    devtool: env?.development ? 'cheap-module-source-map' : false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                loader: 'url-loader',
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                oneOf: [
                    {
                        resourceQuery: /inline/,
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    exportType: 'string',
                                    esModule: false,
                                },
                            },
                            'postcss-loader',
                        ],
                    },
                    {
                        use: ['style-loader', 'css-loader', 'postcss-loader'],
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|otf|eot)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.less$/i,
                use: ['style-loader', 'css-loader', 'less-loader'],
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
        alias: {
            react: path.resolve('./node_modules/react'),
        },
    },
    plugins: [
        new EnvironmentPlugin([]),
        new CSSBuilderPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `./src/manifest${
                        env?.platform === 'opera' ? 'Opera' : ''
                    }.json`,
                    to: 'manifest.json',
                    force: true,
                },
                {
                    from: './src/sidebar/sidebar.html',
                    force: true,
                },
                {
                    context: './src/assets/icons',
                    from: '*.png',
                    to: 'icons',
                    force: true,
                },
                {
                    from: './src/_locales',
                    to: '_locales',
                    force: true,
                },
            ],
        }),
        new ZipPlugin({
            path: path.resolve(__dirname, 'release'),
            filename:
                env?.platform === 'opera'
                    ? `build-opera-${version}.zip`
                    : `build-${version}.zip`,
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
});
