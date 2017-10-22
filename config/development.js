'use strict';

const {pukeLoggerConfig} = require('./logger_util');

const config = {};

config.port = 8080;

config.logger = {
    app: pukeLoggerConfig('product_demo', 'development', {src: true}),
    server: pukeLoggerConfig('webserver.out', 'development', {src: true}),
    err: pukeLoggerConfig('webserver.err', 'development', {
        streamLevel: 'error',
        fileLevel: 'error',
        src: true
    })
};

// Webpack related configs Refer
// https://vuejs-templates.github.io/webpack/backend.html
config.assetsPublicPath = '/'; // Not entirely sure why we need this
config.proxy = {};
// CSS Sourcemaps off by default because relative paths are "buggy" with this
// option, according to the CSS-Loader README
// (https://github.com/webpack/css-loader#sourcemaps) In our experience, they
// generally work as expected, just be aware of this issue when enabling this
// option.
config.cssSourceMap = false;
config.extractCss = false;
config.jsSourceMap = true;
config.env = require('./dev.env');

module.exports = config;
