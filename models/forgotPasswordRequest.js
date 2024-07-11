const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
  requestUUID: { 
    type: String, 
    required: true 
},
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(
  "forgotPasswordRequest",
  forgotPasswordRequestSchema
);
