const express = require('express');
const router = express.Router();
const handleSignUp = require('../controller/auth/handleSignUp');
const handleLogin = require('../controller/auth/handleLogin');
const verifyUser = require('../middleware/verifyUser');
const handleGetUser = require('../controller/auth/handleGetUser');
const handleResetPassword = require('../controller/auth/handleResetPassword');
const validateResetPassword = require('../validators/auth/resetPassword.validator');
const handleLogout = require('../controller/auth/handleLogout');
const handleRefreshToken = require('../controller/auth/handleRefreshToken');
// get

router.get('/api/auth/getUser', verifyUser, handleGetUser);

// post
router.post('/api/auth/logout', verifyUser, handleLogout);
router.post('/api/auth/login', handleLogin);
router.post('/api/auth/signup', handleSignUp);
router.post('/api/auth/resetPassword', verifyUser, validateResetPassword, handleResetPassword)

router.post('/api/auth/refreshtoken', handleRefreshToken);



module.exports = router;