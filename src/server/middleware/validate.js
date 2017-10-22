'use strict';

const debug = require('debug')('product_demo:middleware:validate');

const _ = require('lodash'),
    Joi = require('joi');

const { util } = require('../core'), { joiOptions } = require('../config');

/**
 * Middleware validate to check request body against desired schema
 *
 * @param {any} schema
 * @returns {function} Middleware function which validates request body against given schema
 */
module.exports = function validate(schema) {
    return function validateMiddleware(req, res, next) {
        const body = req.body;
        debug('Validating', body);
        const valObj = Joi.validate(body, schema, joiOptions);
        debug('Validation result - %j', valObj);
        if (!valObj.error) {
            // No error. But push joi transformations back into request body
            req.body = valObj.value;
            return next();
        }
        const detailsObj = {};
        const errObj = valObj.error;
        for (const err of errObj.details) {
            // Should we accept another function parameter to check for error types?
            // err.path is the field
            // Update the error for field if there is one already
            detailsObj[err.path] = util.parseDetails(err, detailsObj[err.path]);
        }
        const errorFields = Object.keys(detailsObj);
        const errorFieldsStr = _.map(errorFields, errField => `'${errField}'`).join(', ');
        // We got a validation error. Skip calling next.
        // https://www.bennadel.com/blog/2434-http-status-codes-for-invalid-data-400-vs-422.htm
        res.status(422).json({
            success: false,
            message: `Validation failed on field${errorFields.length > 1 ? 's': ''} ${errorFieldsStr}.`,
            error: true,
            response: {
                errorType: 'validation_error',
                errorFields,
                details: _.map(errorFields, field => detailsObj[field])
            }
        });
    };
};
