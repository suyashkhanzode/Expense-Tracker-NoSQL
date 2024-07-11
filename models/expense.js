const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount :{
        type :Number,
        required: true
    },
    description :{
        type: String,
        required: true
    },
    category :{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users',
        required: true
    }
});

module.exports = mongoose.model('expense',expenseSchema);