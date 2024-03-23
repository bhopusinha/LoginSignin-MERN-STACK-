const express = require('express');
const { register, login, logout, getUser, resetToken, getResetToken, getAllUser,updateMe,updatePassword, getSingleUser, userRoleUpdate, userDelete } = require('../controller/userController');
const { isAuth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(isAuth, getUser);
router.route('/password/forgot').post(resetToken);
router.route('/password/reset/:token').put(getResetToken);
router.route('/password/update').put(isAuth,updatePassword);
router.route('/me/update').put(isAuth,updateMe)

// Admin
router.route('/admin/user').get(isAuth,isAdmin('admin'),getAllUser);
router.route('/admin/user/:id').get(isAuth,isAdmin('admin'),getSingleUser).put(isAuth,isAdmin('admin'),userRoleUpdate).delete(isAuth,isAdmin('admin'),userDelete);


module.exports = router;