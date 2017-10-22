'use strict';

const debug = require('debug')('demo:nodemon');

/* eslint-disable newline-per-chained-call */

const nodemon = require('nodemon');

nodemon({
    script: 'src/app.js',
    restartable: 'rs',
    ignore: [
        '.git', 'dist/**', 'node_modules/**/node_modules'
    ],
    verbose: true,
    delay: '5000',
    watch: [
        'src/app.js', 'src/server', 'build', 'config'
    ],
    stdout: true,
    ext: 'js json'
}).on('start', () => {
    debug('Dev Daemon started, watching server files');
}).on('restart', files => {
    debug('App restarted due to: ', JSON.stringify(files, null, 2));
});
