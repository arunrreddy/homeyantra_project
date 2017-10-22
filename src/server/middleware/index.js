'use strict';

const debug = require('debug')('product_demo:middleware');

const path = require('path');

const express = require('express'),
    history = require('connect-history-api-fallback');

const setupApiMiddleware = require('./setup_api_middleware'),
    validate = require('./validate'),
    errorHandler = require('./error_handler');

exports.setupMiddleware = function setupMiddleware(app, port, config) {
    debug('Setting up helper middleware');

    const {
        nodeEnv,
        assetsRoot,
        assetsPublicPath,
        assetsSubDirectory
    } = config;

    const isDevEnv = nodeEnv === 'development';

    app.disable('x-powered-by');

    // handle fallback for HTML5 history API
    app.use(history({
        verbose: isDevEnv
    }));

    // serve pure static assets
    // We only seem to need this with development env
    // Should investigate eliminating the 2 redundant properties
    const staticPath = path.posix.join(assetsPublicPath, assetsSubDirectory);

    if (isDevEnv) {
        require('./dev_hot_pack')(app, port);
        // Is this required?
        app.use(staticPath, express.static('./static'));
    } else {
        // For index.html in dist and js, css files in dist/static
        app.use(express.static(assetsRoot));
        // TODO: Do stuff to serve gz version files
        // steal source code from here - https://github.com/code42day/connect-gzip-static/blob/master/lib/gzip-static.js
    }
};

exports.errorHandler = errorHandler;
exports.setupApiMiddleware = setupApiMiddleware;
exports.validate = validate;
// TODO: Add validation middleware
