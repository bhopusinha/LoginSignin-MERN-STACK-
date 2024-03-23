class ErrorHandler extends Error {
    constructor(message, statuscode) {
        super(message);
        this.statuscode = statuscode,
        this.message=message
            Error.captureStackTrace(this, this.constructor);
    }


}


module.exports = ErrorHandler;