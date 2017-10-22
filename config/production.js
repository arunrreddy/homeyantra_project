'use strict';

const {pukeLoggerConfig} = require('./logger_util');

const config = {};

config.port = 8080;

config.logger = {
    app: pukeLoggerConfig('product_demo', 'production', {count: 10}),
    server: pukeLoggerConfig('webserver.out', 'production', {count: 10}),
    err: pukeLoggerConfig('webserver.err', 'production', {
        streamLevel: 'error',
        fileLevel: 'error',
        count: 10
    })
};

// Webpack related configs Refer
// https://vuejs-templates.github.io/webpack/backend.html
config.assetsPublicPath = '/'; // Not entirely sure why we need this
config.cssSourceMap = false;
config.jsSourceMap = true;
config.extractCss = false;
config.productionSourceMap = false;
// Gzip off by default as many popular static hosts such as Surge or Netlify
// already gzip all static assets for you. Before setting to `true`, make sure
// to: npm install --save-dev compression-webpack-plugin
config.gzip = true;
config.gzipExtensions = ['js', 'css'];

config.env = require('./prod.env');

module.exports = config;
