'use strict';

module.exports = function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    // TODO: Send formatted Error response here.
    res.status(500).json({});
    // res.render('error', { error: err });
};
