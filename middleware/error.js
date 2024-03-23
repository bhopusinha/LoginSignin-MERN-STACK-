const ErrorHandler=require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || 'Internal server error';

    if (err.name === 'CastError') {
        const message = `resource not found : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    if (err.message.code === 11000) {
        const message = `Duplicate ${Object.keys(err.message.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }
    
    res.status(err.statuscode).json({
        success: false,
        message: err.message,
    })
}