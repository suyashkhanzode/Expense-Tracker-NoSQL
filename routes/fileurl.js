const express = require('express');

const router = express.Router();

const fileurlController = require('../controllers/fileurl');
const auth = require('../middlerware/auth')

router.get('/all-files',auth.authenticate,fileurlController.dowloadedFiles)

module.exports = router;