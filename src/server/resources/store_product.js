'use strict';
const _ = require('lodash');
const debug = require('debug')('product_demo:store_product');
const { dbClient } = require('../dao');
const { logger, util } = require('../core');

module.exports = async function storeProduct(req, res, next){
    debug('Entered store product resource');
    logger.info('Product Details', req.body);
    const productId = req.body.product_id;
    try {
        const product = await dbClient.getProduct(productId);
        logger.info('Product info', product);
        if(_.isEmpty(product)){
            const dbResponse = await dbClient.storeProduct(req.body);
            res.json({
                success: true,
                message: 'Product stored successfully',
                statusCode: 200,
                error: false,
                response: {
                    productId
                }
            });
        } else {
            res.json({
                success: true,
                message: 'Product already exist in database',
                statusCode: 200,
                error: false,
                response: {
                    productId
                }
            });
        }
    } catch(err){
        logger.error('Error while storing product ', err);
        util.errorResponse(res, err);
    }
};

