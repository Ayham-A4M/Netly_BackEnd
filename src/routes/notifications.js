const express = require('express');
const router = express.Router();
const verifyUser=require('../middleware/verifyUser');
const handleGetNotifications = require('../controller/notification/handleGetNotifications');
const handleReadNotifications = require('../controller/notification/handleReadNotifications');
router.get('/api/notification/getNotification',verifyUser,handleGetNotifications);
router.post('/api/notification/read',verifyUser,handleReadNotifications);


module.exports = router;