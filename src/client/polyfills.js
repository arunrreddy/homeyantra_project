import _ from 'lodash';
/**
 * Figures out which browser is a shitty browser
 * It is obvious that it is IE(Oh god! Don't get me started)
 * @returns {Boolean}
 */
function isShittyBrowser() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    // If Internet Explorer, return version number
    // eslint-disable-next-line no-useless-escape
    if (msie > 0 || Boolean(navigator.userAgent.match(/Trident.*rv\:11\./))) {
        return true;
    }
    return false;
}

const availablePolyfills = [
    {
        test: () => !_.isFunction(window.fetch),
        load: () => require.ensure([], () => require('whatwg-fetch'), 'polyfills-fetch')
    },
    {
        test: isShittyBrowser,
        load: () => require.ensure([], () => require('babel-polyfill'), 'polyfills-shit')
    }
];

/**
 * Load polyfills and call initialize.
 * @param {Function} initialize
 */
export default function loadPolyfills(initialize) {
    // eslint-disable-next-line lodash/prefer-invoke-map
    const polyfillPromises = _.map(
        _.filter(
            availablePolyfills,
            polyfill => polyfill.test()
        ),
        polyfill => polyfill.load()
    );
    if (!_.isEmpty(polyfillPromises)) {
        Promise.all(polyfillPromises)
            .then(() => initialize())
            .catch(err => {
                // TODO: Handle the error
                console.log(err);
            });
    } else {
        // load without polyfills
        initialize();
    }
}
