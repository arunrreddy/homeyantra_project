'use strict';

const express = require('express');

const { setupApiMiddleware, validate } = require('../middleware');
const { productSchema } = require('../schemas');
const {
    storeProduct, getProducts
} = require('../resources');

module.exports = function setupApiRouter(app, config) {
    const apiRouter = express.Router(); // eslint-disable-line new-cap
    setupApiMiddleware(apiRouter, config);

    apiRouter.post('/products', validate(productSchema), storeProduct);

    apiRouter.get('/products', getProducts);

    app.use('/api', apiRouter);
};
