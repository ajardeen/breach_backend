const express = require('express');
const router = express.Router();
const {search} = require('../Controllers/SearchController');

router.post('/search', search);

module.exports = router;