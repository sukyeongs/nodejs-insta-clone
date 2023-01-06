const mongoose = require('mongoose');

// User schema
const userSchema = mongoose.Schema({
    username: {
        type : String,
        maxlength : 30,
        required : true,
        unique : 1
    },
    realname: {
        type : String,
        maxlength : 64,
        required : false
    },
    password: {
        type : String,
        minlength : 6,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : 1
    },
    email_agree: {
        type : Boolean,
        required : 1
    }
})

module.exports = mongoose.model('User', userSchema);