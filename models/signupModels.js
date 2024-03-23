const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signUpSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "name should be 3 or greater than character!"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validate.isEmail, "write correct email"],
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [8, "password should be 8 character or greater than !"]
    },
    role:{
        type:String,
        default:'user'
    },
    avatar:{
        public_id:{
              type:String,
              required:true,
        },
        url:{
             type:String,
             required:true,
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetePasswordToken: String,
    resetPasswordTokenExpire: Date

})

signUpSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10);
})

signUpSchema.methods.jsonToken = function () {

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

signUpSchema.methods.isPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

signUpSchema.methods.resetToken = async function () {
    const token = await crypto.randomBytes(20).toString('hex');

    this.resetePasswordToken = await crypto.createHash('sha256').update(token).digest('hex');

    this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;

    return token;
}


module.exports = mongoose.model('SignLogin', signUpSchema);