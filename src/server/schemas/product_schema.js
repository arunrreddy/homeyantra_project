'use strict';

const Joi = require('joi');

/* eslint-disable lodash/prefer-lodash-method */

module.exports = Joi.object({
    product_id: Joi.string()
        .required(),
    product_name: Joi.string()
        .required(),
    product_type_id: Joi.number()
        .required(),
    price: Joi.number()
        .required(),
    image_url: Joi.string()
        .required(),
    quantity: Joi.string()
        .required()
});
