const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({

  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
  },
  user : {
    type : Schema.Types.ObjectId,
    ref : 'users',
    required: true
}

});

module.exports = mongoose.model('order',orderSchema);
