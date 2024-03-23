const User = require('../models/signupModels');
const ErrorHandler = require('../utils/errorHandler');
const cathAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendMail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary');


const register = cathAsyncError(async (req, res, next) => {

    const { name, email, password, avatar } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload_large(avatar, {
        folder: "login",
        upload_preset: "myCloud",
        chunk_size: 6000000,
        width: 400,
        height: 450,
        quality: 100,
        crop: "scale",
    })


    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user, 200, res);

})

const login = cathAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Enter Email and password!", 404));
    }

    const user = await User.findOne({ email: email }).select('+password');


    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }


    const isPassword = await user.isPassword(password);

    if (!isPassword) {
        return next(new ErrorHandler('enter email password is wrong', 404));
    }

    sendToken(user, 200, res);
})


const updatePassword = cathAsyncError(async (req, res, next) => {

    const { oldPassword, newPassword, confirmPassword } = req.body;

    let user = await User.findById(req.user.id).select('+password');

    const byPass = await bcrypt.compare(oldPassword, user.password);

    if (!byPass) {
        return next(new ErrorHandler('oldPassword is not matching', 402));
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('newPassword and confirmPassword should be same !', 404));
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "password changed!"
    })

})


const logout = cathAsyncError(async (req, res, next) => {

    const options = {
        expiresIn: new Date(Date.now()),
        httpOnly: true
    }

    res.status(200).cookie('token', null, options).json({
        success: true,
        message: "user log out"
    })
})

const getUser = cathAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next('pls login to access this resource', 400);
    }


    res.status(202).json({
        success: true,
        user
    })
})

const resetToken = cathAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }

    const getToken = await user.resetToken();


    await user.save({ validateBeforeSave: false });

    const resetPasswordTokenUrl = `${req.protocol}://${req.get('host')}/password/reset/${getToken}`;

    const message = `this is your reset password toke \n\n ${resetPasswordTokenUrl} \n\n if you have not requested this email then ,pls ignore it !`;

    try {

        await sendEmail(user, message);
        res.status(200).json({
            success: true,
            message: "email send successfully !"
        })

    } catch (e) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(e.message, 500))
    }

})

const getResetToken = cathAsyncError(async (req, res, next) => {

    const getToken = req.params.token;


    const resetPasswordToken = await crypto.createHash('sha256').update(getToken).digest('hex');

    const user = await User.findOne({
        resetePasswordToken: resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('the reset token is wrong or has expired', 500));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('password and confirm password should be same !', 404));
    }

    user.password = req.body.password;

    user.resetePasswordToken = undefined
    user.resetPasswordTokenExpire = undefined

    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);

})


const updateMe = cathAsyncError(async (req, res, next) => {

    let user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }

    user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true
    });

    res.status(200).json({
        success: true,
        user
    })

})

// Admin
const getAllUser = cathAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

const getSingleUser = cathAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler('user not found', 404));
    }

    res.status(202).json({
        success: true,
        user
    })
})

const userRoleUpdate = cathAsyncError(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler('user not found', 404));
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    res.status(200).json({
        success: true,
        user
    })

})

const userDelete = cathAsyncError(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler('user not found', 404));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(202).json({
        success: true,
        message: 'user deleted!'
    })
})


module.exports = { register, login, logout, getUser, resetToken, getResetToken, getAllUser, updateMe, updatePassword, getSingleUser, userRoleUpdate, userDelete }