'use strict';

const debug = require('debug')('product_demo:store_product');
const {dbClient} = require('../dao');
const {logger, util} = require('../core');

module.exports = async function getProducts(req, res, next){
    debug('Entered get products resource');
    try{
        const products = await dbClient.getProducts();
        res.json({
            success: true,
            error: false,
            message: 'Retrieved products successfully',
            response: {
                products
            }
        });
    } catch(err){
        util.errorResponse(res, err);
    }
}
