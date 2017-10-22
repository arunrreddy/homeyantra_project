'use strict';

const path = require('path');

const _ = require('lodash'),
    webpack = require('webpack');

const config = require('../config'),
    utils = require('./utils'),
    baseWebpackConfig = require('./webpack.base.conf');

const merge = require('webpack-merge'),
    WebpackStrip = require('strip-loader'),
    LodashModuleReplacementPlugin = require('lodash-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

// const vendorExclude = /whatwg-fetch/;

const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.productionSourceMap
        ? '#source-map'
        : false,
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: WebpackStrip.loader('debug')
            }
        ]
    },
    output: {
        path: config.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    performance: {
        hints: 'warning'
    },
    plugins: [
        // https://webpack.js.org/plugins/loader-options-plugin/
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                context: appRoot
            }
        }),
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({'process.env': config.env}),
        // https://github.com/lodash/lodash-webpack-plugin
        new LodashModuleReplacementPlugin({
            coercions: true,
            paths: true,
            guards: true,
            unicode: true,
            collections: true,
            shorthands: true
        }),
        new webpack.NormalModuleReplacementPlugin(/debug/, path.join(appRoot, 'build', 'noop.js')),
        new webpack
            .optimize
            .UglifyJsPlugin({
                sourceMap: config.jsSourceMap, beautify: true, // Change to false for PROD
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true // Adds 10kb to vendor js. Change to false for PROD
                },
                compress: {
                    screw_ie8: true,
                    warnings: false,
                    // Drop console statements
                    drop_console: true
                },
                comments: false
            }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            disable: false,
            allChunks: true
        }),
        // generate dist index.html with correct asset hash for caching. you can
        // customize output by editing /index.html see
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options: https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // TODO: Investigate if there is a better solution split vendor js into its own
        // file
        new webpack
            .optimize
            .CommonsChunkPlugin({
                name: 'vendor',
                // eslint-disable-next-line no-shadow, no-unused-vars
                minChunks(module, count) {
                    // any required modules inside node_modules are extracted to vendor
                    return (module.resource && (/\.js$/).test(module.resource) && _.startsWith(module.resource, path.join(appRoot, 'node_modules')) // &&
                    // To keep fetch in a separate file. !vendorExclude.test(module.resource)
                    );
                }
            }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack
            .optimize
            .CommonsChunkPlugin({name: 'manifest', chunks: ['vendor']})
    ]
});

if (config.gzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig
        .plugins
        .push(new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(`\\.(${config.gzipExtensions.join('|')})$`),
            threshold: 10240,
            minRatio: 0.8
        }));
}

module.exports = webpackConfig;
