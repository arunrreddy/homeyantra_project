'use strict';

const debug = require('debug')('product_demo:dao:demo_db_client');
const _ = require('lodash');

const config = require('../config'),
    { logger, util } = require('../core');

const writer = require('knex')(config.knexWriterDb);

const TBL_PRODUCTS = 'products',
    TBL_PRODUCT_TYPES = 'product_types',
    PRODUCT_JOIN_COND = {'products.product_type_id': 'product_types.id'};
const PRODUCT_COLS = ['product_id', 'product_types.name as product_type', 'product_name', 'image_url', 'price', 'quantity'];

exports.writer = writer;

/**
 * @param {Error} err
 * @param {Object} obj
 */
function logQueryError(err, obj) {
    logger.error(err, obj);
}

writer.on('query-error', logQueryError);

/**
 *
 * @param {Object} productDetails
 * @returns {Promise}
 */
exports.storeProduct = function storeProduct(productDetails) {
    debug('Entered store product');
    return writer.insert(productDetails).into(TBL_PRODUCTS).returning('product_id')
        .then(productId => _.head(productId));
};


exports.getProducts = function getProducts() {
    return writer.select(PRODUCT_COLS)
        .from(TBL_PRODUCTS)
        .innerJoin(TBL_PRODUCT_TYPES, PRODUCT_JOIN_COND);
};

exports.getProduct = function getProduct(productId){
    debug('Entered get product');
    return writer.select('*')
        .from(TBL_PRODUCTS)
        .where({ product_id: productId });
}
