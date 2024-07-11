const express = require('express');

const passwordController = require('../controllers/password');


const router = express.Router();

router.post('/forgot-password',passwordController.forgotPassword);
router.get('/reset-password/:requestUUID',passwordController.resetPassword);
router.put('/update-password/:requestUUID',passwordController.updatePassword);

module.exports = router;