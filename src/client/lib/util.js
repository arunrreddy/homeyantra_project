import _ from 'lodash';
import { Message } from 'element-ui';

const debug = require('debug')('product_demo:lib:util');

/**
 * Default catch funciton
 *
 * @param {Error} err
 */
export function defaultCatch(err) {
    debug('Caught something nasty', err);
    Message.error({ message: err.message });
}

export const responseHelper = (onSuccess, onFailure) => apiResponse => {
    if (_.has(apiResponse, 'jsonRes')) {
        const { jsonRes: { success, error, message, statusCode, response } } = apiResponse;
        if (success && !error) {
            onSuccess(response, message);
        } else {
            onFailure(message, statusCode, response);
        }
        return apiResponse;
    }
    onFailure('');
};

