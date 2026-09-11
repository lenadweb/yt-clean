const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CSSBuilderPlugin = require('./cssBuilder');
const { version } = require('./package.json');
require('dotenv').config({ quiet: true });

const posthogToken = process.env.VITE_POSTHOG_PROJECT_TOKEN?.trim() || '';
const posthogHost = new URL(
    process.env.VITE_POSTHOG_HOST?.trim() || 'https://eu.i.posthog.com'
);
if (
    posthogHost.protocol !== 'https:' ||
    posthogHost.username ||
    posthogHost.password
) {
    throw new Error('VITE_POSTHOG_HOST must be an HTTPS ingestion host');
}

module.exports = (env) => ({
    mode: env?.development ? 'development' : 'production',
    entry: {
        worker: `${__dirname}/src/worker/index.ts`,
        player: `${__dirname}/src/player/index.ts`,
        sidebar: `${__dirname}/src/sidebar/index.tsx`,
        onboarding: `${__dirname}/src/onboarding/index.tsx`,
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
        new DefinePlugin({
            'process.env.VITE_POSTHOG_PROJECT_TOKEN':
                JSON.stringify(posthogToken),
            'process.env.VITE_POSTHOG_HOST': JSON.stringify(posthogHost.origin),
        }),
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
                    from: './src/onboarding/onboarding.html',
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
                    : `build-chrome-${version}.zip`,
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
