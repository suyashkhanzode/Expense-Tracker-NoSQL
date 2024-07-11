const Order = require('../models/order');
const RazorPay = require('razorpay');
const User = require('../models/user');

require('dotenv').config();

exports.orderPremium = async (req, res, next) => {

    try {
        const rzp = new RazorPay({
            key_id: process.env.ROZORPAY_KEY_ID ,
            key_secret: process.env.ROZORPAY_KEY_SECRET
        });

        const amount = 5 * 100;
        
        const order = await rzp.orders.create({ amount, currency: 'INR' });
        
        const newOrder = new Order({
            orderId: order.id,
            status: "PENDING",
            user: req.user.id 
        });

        const savedOrder = await newOrder.save();

        res.status(200).json({ order :savedOrder, amount, key_id: rzp.key_id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.verifyPayment = async (req, res, next) => {
    debugger;
    try {
        const { order_id, payment_id } = req.body;

        const order = await Order.findOne({ orderId: order_id });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.paymentId = payment_id;
        order.status = "SUCCESSFUL";

        await order.save();

        const user = await User.findById(order.user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isPremium = true;
        await user.save();

        res.status(202).json({ success: true, message: "Transaction Complete" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
