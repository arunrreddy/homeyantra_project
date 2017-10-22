'use strict';

const debug = require('debug')('product_demo:api_middleware');

const bunyanLogger = require('express-bunyan-logger'),
    bodyParser = require('body-parser');

module.exports = function setupApiMiddleware(apiRouter, config) {
    debug('Setting up API middleware');

    const {
        logger: { server: serverLoggerConf, err: errLoggerConf }
    } = config;

    // Logging only for API requests.
    // Logging for static files not required
    apiRouter.use(bunyanLogger(serverLoggerConf));
    apiRouter.use(bunyanLogger.errorLogger(errLoggerConf));

    // parse application/x-www-form-urlencoded
    apiRouter.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    apiRouter.use(bodyParser.json());
};
