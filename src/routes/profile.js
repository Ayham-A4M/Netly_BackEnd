const express = require('express');
const router = express.Router();
const upload = require('../utils/imageUpload');
const verifyUser = require('../middleware/verifyUser');

const handleGetUserProfile = require('../controller/profile/handleGetUserProfile')
const handleUpdateAboutInformation = require('../controller/profile/handleUpdateAboutInformation')
const handleGetUserProfileById = require('../controller/profile/handleGetUserProfileById')
const validateUpdateAbout = require('../validators/profile/updateAbout.validator');
const handleUpdateCoverImage = require('../controller/profile/handleUpdateCoverImage');
const handleFollowProcess = require('../controller/profile/handleFollowProcess');
const handleUpdateAvatar = require('../controller/profile/handleUpdateAvatar');
const handleGetProfileCard = require('../controller/profile/handleGetProfileCard');
const handleUnFollowProcess = require('../controller/profile/handleUnFollowProcess');
const handleGetConnections = require('../controller/profile/handleGetConnections');

router.get('/api/profile/getUserProfile', verifyUser, handleGetUserProfile);
router.get('/api/profile/getProfileById', verifyUser, handleGetUserProfileById);
router.get('/api/profile/profileCard', verifyUser, handleGetProfileCard);
router.get('/api/profile/connections/:getFollowers',verifyUser,handleGetConnections);

router.post('/api/profile/updateCoverImage', verifyUser, upload.single('image'), handleUpdateCoverImage);
router.post('/api/profile/updateAboutInformation', verifyUser, validateUpdateAbout, handleUpdateAboutInformation);
router.post('/api/profile/follow', verifyUser, handleFollowProcess);
router.post('/api/profile/updateAvatar', verifyUser, upload.single('image'), handleUpdateAvatar);

router.delete('/api/profile/unfollow/:profileId', verifyUser, handleUnFollowProcess);


module.exports = router;
