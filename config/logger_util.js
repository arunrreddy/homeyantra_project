'use strict';

const fs = require('fs'),
    path = require('path');

const {spawn} = require('child_process');

const bunyan = require('bunyan'),
    through = require('through');

const logDir = path.join(appRoot, 'logs');

/**
 * Pretty print bunyan logs in development mode using stream
 *
 * @param {Array} args
 * @return {WritableStream}
 */
function prettyStream(args = ['-o', 'long']) {
    const bin = path.join(appRoot, 'node_modules', 'bunyan', 'bin', 'bunyan');
    const stream = through(function write(data) {
        this.queue(data); // eslint-disable-line no-invalid-this
    }, function end() {
        this.queue(null); // eslint-disable-line no-invalid-this
    });

    if (bin && fs.existsSync(bin)) {
        const formatter = spawn('node', [
            bin, ...args
        ], {
            stdio: [null, process.stdout, process.stderr]
        });
        stream.pipe(formatter.stdin);
    }

    return stream;
}

/**
 * @param {string} name
 * @param {strin} nodeEnv
 * @returns {Object}
 */
exports.pukeLoggerConfig = function pukeLoggerConfig(name, nodeEnv, {
    streamLevel = 'debug',
    fileLevel = 'info',
    src = false,
    count = 3
} = {}) {
    const outStream = nodeEnv === 'production'
        ? process.stdout
        : prettyStream();
    return {
        name,
        streams: [
            {
                stream: streamLevel === 'error'
                    ? process.stderr
                    : outStream,
                level: streamLevel
            }, {
                type: 'rotating-file',
                path: path.join(logDir, `${name}.log`),
                level: fileLevel,
                period: '1d', // daily rotation
                count // keep 3 back copies
            }
        ],
        src,
        serializers: bunyan.stdSerializers
    };
};


exports.levelFn = function levelFn(status, err, meta) {
    /* only will work in error logger */
    // return string of level
    if (meta['response-time'] > 30000) {
        return 'fatal';
    }
    return 'info';
};
