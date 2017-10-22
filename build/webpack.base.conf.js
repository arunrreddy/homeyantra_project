'use strict';

const path = require('path');

const webpack = require('webpack');

const config = require('../config');
const utils = require('./utils');

// check env & config/index.js to decide whether to enable CSS source maps for
// the various preprocessor loaders added to vue-loader at the end of this file

const clientRoot = path.join(appRoot, 'src', 'client');

module.exports = {
    context: appRoot,
    entry: {
        fetch: 'whatwg-fetch',
        app: './src/client/main.js'
    },
    output: {
        path: config.assetsRoot,
        publicPath: config.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        modules: [
            appRoot, path.join(appRoot, 'node_modules')
        ],
        enforceExtension: false,
        extensions: [
            '.js', '.vue', '.json'
        ],
        alias: {
            client: clientRoot,
            assets: path.join(clientRoot, 'assets'),
            lib: path.join(clientRoot, 'lib'),
            components: path.join(clientRoot, 'components'),
            views: path.join(clientRoot, 'views')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [path.join(appRoot, 'src')],
                exclude: /node_modules/
            }, {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [path.join(appRoot, 'src')],
                exclude: /node_modules/,
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: utils.cssLoaders({sourceMap: config.cssSourceMap, extract: config.extractCss}),
                    postcss: [require('autoprefixer')({
                            browsers: ['last 2 versions', 'ie > 8']
                        })]
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.join(appRoot, 'src')],
                exclude: /node_modules/
            },
            ...utils.styleLoaders({sourceMap: config.cssSourceMap, extract: config.extractCss, moduleRules: true}), {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [// eslint-disable-next-line no-useless-escape
        new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')]
};
