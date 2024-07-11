const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileUrlSchema = new Schema({
    url :{
        type : String
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users',
        required: true
    }
})

module.exports = mongoose.model('fileurl',fileUrlSchema);