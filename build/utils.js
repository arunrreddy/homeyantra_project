'use strict';

const path = require('path');
const config = require('../config');
const _ = require('lodash'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = function assetsPath(_path) {
    const assetsSubDirectory = config.assetsSubDirectory;
    return path
        .posix
        .join(assetsSubDirectory, _path);
};

const cssLoaders = exports.cssLoaders = function cssLoaders(options = {}) {
    let defaultLoaderOptions = false;
    if (options.sourceMap) {
        defaultLoaderOptions = {
            sourceMap: options.sourceMap
        };
    }
    const moduleRules = options.moduleRules;

    /**
     * generate loader string to be used with extract text plugin
     *
     * @param {Array} loaders
     * @return {Array} Array of loaders to be used
     */
    function generateLoaders(loaders) {
        // Would be nice to use loader object instead of loader strings joined with '!'
        // But vue-loader cannot handle it.
        const sourceLoaders = _.map(loaders, loader => {
            if (_.isString(loader)) {
                const loaderName = `${loader}-loader`;
                if (defaultLoaderOptions !== false) {
                    return `${loaderName}?${JSON.stringify(defaultLoaderOptions)}`;
                }
                return loaderName;
            }
            if (defaultLoaderOptions !== false) {
                _.assignIn(loader.options, defaultLoaderOptions);
            }
            return `${loader
                .loader}?${JSON
                .stringify(loader.options)}`;
        });

        // Extract CSS when that option is specified (which is the case during
        // production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({loader: sourceLoaders, fallbackLoader: 'vue-style-loader'});
        }
        if (moduleRules === true) {
            return [
                'vue-style-loader', ...sourceLoaders
            ];
        }
        // Has to return string as response here if not for module rules in webpack
        // config list throws exception in vue-loader
        return [
            'vue-style-loader', ...sourceLoaders
        ].join('!');
    }

    // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
    return {
        css: generateLoaders(['css']),
        postcss: generateLoaders(['css']),
        less: generateLoaders(['css', 'less']),
        sass: generateLoaders([
            'css', {
                loader: 'sass-loader',
                options: {
                    indentedSyntax: true
                }
            }
        ]),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders(['css', 'stylus']),
        styl: generateLoaders(['css', 'stylus'])
    };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function styleLoaders(options) {
    const output = [];
    const cssLoadersMap = cssLoaders(options);
    for (const extension in cssLoadersMap) {
        if (!_.has(cssLoadersMap, extension)) {
            continue;
        }
        const loaders = cssLoadersMap[extension];
        output.push({
            test: new RegExp(`\\.${extension}$`),
            use: loaders
        });
    }
    return output;
};
