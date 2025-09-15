const express = require('express');
const verifyUser = require('../middleware/verifyUser');
const handleCreateEvent = require('../controller/event/handleCreateEvent');
const validateNewEvent = require('../validators/event/newEvent.validator');
const handleGetEvents = require('../controller/event/handleGetEvents');
const handleInterestingInEvent = require('../controller/event/handleInterestingInEvent');
const handleUnInterestingEvent = require('../controller/event/handleUnInterestingEvent');
const router = express.Router();

router.get('/api/event/events/:filter', verifyUser, handleGetEvents);


router.post('/api/event/newevent', verifyUser, validateNewEvent, handleCreateEvent);
router.post('/api/event/interesting/:eventId', verifyUser, handleInterestingInEvent);
router.delete('/api/event/interesting/:eventId', verifyUser, handleUnInterestingEvent);

module.exports = router