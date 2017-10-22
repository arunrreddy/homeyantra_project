'use strict';

/**
 * Main startup file.
 */
const path = require('path');

global.appRoot = path.resolve(__dirname, '..');
global.rootRequire = name => require(path.join(appRoot, name));

require('../build/check-versions')();
const debug = require('debug')('product_demo:app');

const http = require('http');

const _ = require('lodash'),
    express = require('express');

const {setupMiddleware, errorHandler} = require('./server/middleware');

global.Promise = require('bluebird');

const setupApiRouter = require('./server/routes'),
    config = require('../config'), {util, logger} = require('./server/core');

const app = express();

/**
 * Get port from environment.
 */
const port = normalizePort(process.env.PORT || config.port);

setupMiddleware(app, port, config);
setupApiRouter(app, config);
// Should be last
app.use(errorHandler);

const httpServer = http.createServer(app);

debug('Starting express app.');
httpServer.listen(port, () => {
    logger.info('Http server running');
});
httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Shutdown all containers and client objects
 */
util.gracefulShutdown(() => {
    logger.info('Shutting down server. No more requests will be accepted.');

    httpServer.close();
    // TODO: Close other closable clients

    setTimeout(() => {
        process.exit();
    }, 1e3).unref();
});

/**
 * Normalize a port into a number, string, or false.
 * @param {string} val
 * @returns {number|string|boolean}
 */
function normalizePort(val) {
    const portNum = parseInt(val, 10);

    if (isNaN(portNum)) {
        // named pipe
        return val;
    }

    if (portNum >= 0) {
        // port number
        return portNum;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = _.isString(port)
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.log(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.log(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = httpServer.address();
    const bind = _.isString(addr)
        ? `pipe ${addr}`
        : `port ${addr.port}`;

    logger.info(`Listening on ${bind}`);

    // open it only in development mode if (config.nodeEnv === 'development') {
    // util.opnIf(`http://localhost:${port}`, 90); }
}
