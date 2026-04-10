const express = require('express');
const { nearby } = require('../controllers/locationController');

const router = express.Router();

router.get('/nearby', nearby);

module.exports = router;
