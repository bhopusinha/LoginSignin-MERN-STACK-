const ErrorHandler = require("../utils/errorHandler");
const jwt = require('jsonwebtoken');
const User = require('../models/signupModels');
const cathAsyncError = require("./catchAsyncError");

const isAuth = cathAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (token.length <= 10) {
        return next(new ErrorHandler('pls login to access this resource', 404));
    }

    const decodeData = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
})

const isAdmin = (...roles) => cathAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler(`Role ${req.user.role} cannot access this resurce`, 403));
    }

    next();
})


module.exports = { isAuth, isAdmin };