const debug = require('debug')('product_demo:api_client');
import FetchHelper from './fetch_helper';

const helper = new FetchHelper({
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'cache-control': 'no-cache'
    }
}, {
});


/**
 * @param {object} product
 * @return {Promise}
 */
export async function storeProduct(product) {
    debug('Sending product details to store');
    return helper.doPost('/api/products', product);
}

/**
 * @return {Promise}
 */
export async function getProducts() {
    debug('Getting products');
    return helper.doGet('/api/products');
}
