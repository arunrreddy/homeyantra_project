'use strict';

const config = require('../config');
const _ = require('lodash'),
    webpack = require('webpack'),
    merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');

// add hot-reload related code to entry chunks
_.forEach(Object.keys(baseWebpackConfig.entry), name => {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    plugins: [
        // https://webpack.js.org/plugins/loader-options-plugin/
        new webpack.LoaderOptionsPlugin({
            debug: false,
            options: {
                context: appRoot
            }
        }),
        new webpack.DefinePlugin({'process.env': config.env}),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({filename: 'index.html', template: 'index.html', inject: true}),
        new FriendlyErrors()
    ]
});
