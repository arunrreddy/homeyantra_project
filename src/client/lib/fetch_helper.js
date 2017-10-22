import _ from 'lodash';
import qs from 'qs';

const debug = require('debug')('product_demo:fetch_helper');

/**
 * Wrapper for fetch.
 *
 * @export
 * @class FetchHelper
 */
export default class FetchHelper {
    /**
     * Creates an instance of FetchHelper.
     *
     * @param {Object} defaultOptions
     * @param {Object=} options
     * @param {string=} options.serverUrl
     *
     * @memberOf FetchHelper
     */
    constructor(
        defaultOptions, {
            serverUrl = ''
        } = {}
    ) {
        this.defaultOptions = defaultOptions;
        this.serverUrl = serverUrl;
    }

    /**
     * Encapsulate common behaviour for fetch API calls.
     *
     * @param {string} url
     * @param {Object} options
     * @returns {Promise}
     *
     * @memberOf FetchHelper
     * @private
     */
    async _fetchHelper(url, options) {
        if (!_.isNil(options.params)) {
            url = `${url}?${qs.stringify(options.params)}`; // eslint-disable-line no-param-reassign
            delete options.params;
        }
        debug('Request Url: ', url);
        const mergedOptions = _.merge({}, this.defaultOptions, options);
        try {
            const response = await fetch(`${this.serverUrl}${url}`, mergedOptions);
            try {
                const jsonRes = await response.json();
                jsonRes.statusCode = response.status;
                response.jsonRes = jsonRes;
            } catch (parseErr) {
                debug('JSON parse for response failed.', parseErr);
            }
            // Throw error if it is internal server error
            // Not found is not acceptable either
            if (!response.ok && (response.status >= 500 || response.status === 404)) {
                let errMsg;
                if (_.has(response, 'jsonRes') && _.has(response.jsonRes, 'message')) {
                    errMsg = `API call to end point ${url} failed(${response.statusText}) ` +
                        `with message '${response.jsonRes.message}'.`;
                } else {
                    errMsg = `API call to end point ${url} failed due to '${response.statusText}'.`;
                }
                const error = new Error(errMsg);
                error.response = response;
                throw error;
            }

            debug('Got response from API', response);
            return response;
        } catch (err) {
            debug(err);
            throw err;
        }
    }

    /**
     *
     * @param {string} url
     * @param {Object} params
     * @return {Promise} resolves to server response, checks status and parses json.
     *
     * @memberOf FetchHelper
     */
    doGet(url, params) {
        const options = {};
        if (!_.isNil(params)) {
            options.params = params;
        }
        return this._fetchHelper(url, options);
    }
}

/**
 * Creates a function for making HTTP call with body with given method
 *
 * @param {string} method
 * @returns {Function}
 */
function composeHttpCallWithBody(method) {
    // eslint-disable-next-line no-invalid-this
    return function httpCallWithBody(url, data, params) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            params
        };
        return this._fetchHelper(url, options); // eslint-disable-line no-invalid-this
    };
}

/**
 * POST data to URL using fetch. Parses JSON if possible to response.jsonRes.
 *
 * @param {string} url
 * @param {Object} data
 * @param {Object} params
 * @param {boolean=} preAndPost
 * @returns {Promise}
 *
 * @memberOf FetchHelper
 */
FetchHelper.prototype.doPost = composeHttpCallWithBody('POST');
