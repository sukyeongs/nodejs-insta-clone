const mongoose = require('mongoose');

// Post schema
const postSchema = mongoose.Schema({
    location: {
        type : String,
        required : false,
    },
    content: {
        type : String,
        maxlength : 500,
        required : false
    },
    writer: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

postSchema.set('timestamps', true);

module.exports = mongoose.model('Post', postSchema);