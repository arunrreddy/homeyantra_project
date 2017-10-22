'use strict';

const debug = require('debug')('product_demo:middleware:dev_hot_pack');

const webpack = require('webpack');

const { util } = require('../core');

module.exports = function devHotPack(app, port) {
    // Refer https://gist.github.com/branneman/8048520
    // eslint-disable-next-line no-undef
    const webpackConfig = rootRequire('build/webpack.dev.conf');
    const compiler = webpack(webpackConfig);

    const devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: false,
        stats: {
            colors: true
        }
    });

    const hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: false
    });
    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', compilation => {
        compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
            hotMiddleware.publish({ action: 'reload' });
            cb();
        });
    });

    // serve webpack bundle output
    app.use(devMiddleware);

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware);

    devMiddleware.waitUntilValid(() => {
        debug(`> Listening at http://localhost:${port}\n`);
    });

    util.gracefulShutdown(() => {
        devMiddleware.close();
    });
};
