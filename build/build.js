'use strict';

const path = require('path');
global.appRoot = path.resolve(__dirname, '..');

// https://github.com/shelljs/shelljs
require('./check-versions')();
require('shelljs/global');
// Shouldn't be required env.NODE_ENV = 'production';

const config = require('../config');
const ora = require('ora');
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.conf');

console.log('  Tip:\n  Built files are meant to be served over an HTTP server.\n  Opening ind' +
        'ex.html over file:// won\'t work.\n');

const spinner = ora('building for production...');
spinner.start();

const assetsPath = path.join(config.assetsRoot, config.assetsSubDirectory);
rm('-rf', assetsPath); // eslint-disable-line no-undef
mkdir('-p', assetsPath); // eslint-disable-line no-undef
cp('-R', 'static/*', assetsPath); // eslint-disable-line no-undef

webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) {
        throw err;
    }
    process
        .stdout
        .write(`${stats.toString({colors: true, modules: false, children: false, chunks: false, chunkModules: false})}\n`);

            process.exit();});
