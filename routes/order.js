const express = require('express');

const router = express.Router();

const orderController = require('../controllers/order');
const auth = require('../middlerware/auth')

router.get('/buy-primium',auth.authenticate,orderController.orderPremium);

router.post('/verify-payment',auth.authenticate,orderController.verifyPayment);



module.exports = router;