'use strict';

const debug = require('debug')('product_demo:core:util');

const fs = require('fs'),
    path = require('path');

const _ = require('lodash');
const config = require('../config');

const {
    ERROR_CODE_MAP,
    ADDITIONAL_INFO,
    ERROR_MESSAGES
} = require('./consts');

/**
 * Extract additional error info from joi error object
 * @param {any} err - Joi error object
 * @returns {string} additional info parsed from error object
 */
function additionalInfo(err) {
    if (ADDITIONAL_INFO.hasOwnProperty(err.type)) {
        return ` ${ADDITIONAL_INFO[err.type]({err})}`;
    }
    return '';
}

/**
 * Parses error info from joi error object
 *
 * @param {any} err
 * @param {any} [details={ field: err.path, errors: [], errCodes: [] }]
 * @returns {any} [details={ field: err.path, errors: [], errCodes: [] }]
 */
exports.parseDetails = function parseDetails(err, details = {
    field: err.path,
    errors: [],
    errCodes: []
}) {
    debug('err - %j, details - %j', err, details);
    const errType = `joi-${err.type}`;
    if (ERROR_CODE_MAP.hasOwnProperty(errType)) {
        const errCode = ERROR_CODE_MAP[errType];
        if (!_.includes(details.errCodes, errCode)) {
            details.errCodes.push(errCode);
            // ERROR_MESSAGES has doT templates for each key
            const message = `${ERROR_MESSAGES[errCode]({err})}${additionalInfo(err)}`;
            const errDetail = { message, errCode };
            details.errors.push(errDetail);
        }
    }
    debug('details - %j', details);
    return details;
};

/**
 * Returns a export name for a given file.
 * If file is '/foo/bar/baz/asdf/some_file.js', 'someFile' is returned
 *
 * @param {string} file
 * @returns {string} Export name for a file
 */
const exportName = exports.exportName = function exportName(file) {
    return _.camelCase(path.basename(file, path.extname(file)));
};

/**
 * Helper function to automate export of resources from a folder.
 * Does not handle recursive directories
 *
 * @param {string} dir
 * @param {Object} dirExports
 * @returns {Object} Dir exports object
 */
exports.exportAll = function exportAll(dir, dirExports = {}) {
    // TODO: Validate the dir is actually a directory and dirExports is actually an object
    const srcFiles = fs.readdirSync(dir);
    for (const srcFile of srcFiles) {
        if (srcFile !== 'index.js') {
            dirExports[exportName(srcFile)] = require(`${dir}/${srcFile}`);
        }
    }
    debug('Exported %j from dir %s', Object.keys(dirExports), dir);
    return dirExports;
};

/**
 * Setup callback on process shutdown signal.
 *
 * @param {function} callback
 */
exports.gracefulShutdown = function gracefulShutdown(callback) {
    let shuttingDown = false;
    _.forEach(['SIGINT', 'SIGTERM', 'SIGUSR2'], signal => {
        process.on(signal, () => {
            if (shuttingDown) {
                return;
            }
            shuttingDown = true;
            callback();
        });
    });
};

exports.errorResponse = function errorResponse(res, err) {
    res.json({
        success: false,
        message: 'Internal server error',
        statusCode: 500,
        error: true,
        response: {
            err
        }
    });
};

