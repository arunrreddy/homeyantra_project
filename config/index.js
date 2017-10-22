'use strict';

// see http://vuejs-templates.github.io/webpack for documentation.
const debug = require('debug')('product_demo:config');

const fs = require('fs'),
    path = require('path');

const _ = require('lodash');

const logDir = path.join(appRoot, 'logs');

/**
 * make a log directory, just in case it isn't there.
 */
try {
    if (!fs.existsSync(logDir)) {
        debug('Creating log directory %s', logDir);
        fs.mkdirSync(logDir);
    }
} catch (err) {
    console.error('Could not set up log directory, error was: ', err);
    process.exit(1);
}

const nodeEnv = process.env.NODE_ENV || 'development';
debug('Node enviroment - %s', nodeEnv);
const config = {};

/*
    Keep common config here
 */
config.nodeEnv = nodeEnv;
// Refer https://vuejs-templates.github.io/webpack/backend.html
config.assetsRoot = path.join(appRoot, 'dist');
config.index = path.join(appRoot, 'dist', 'index.html');
// Not entirely sure why we need the following property
config.assetsSubDirectory = 'static';

config.joiOptions = {
    abortEarly: false,
    convert: true
};

switch (nodeEnv) {

    case 'staging':
        _.merge(config, require('./staging'));
        break;

    case 'production':
        _.merge(config, require('./production'));
        break;

    default: // case 'development':
        _.merge(config, require('./development'));

}

config.knexfile = require('./knexfile');

config.knexWriterDb = config.knexfile[nodeEnv];

module.exports = config;
