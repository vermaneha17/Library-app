const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
    title: {
        type: String,
        required: true,
        max: 100
    },
    genre: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'Author', 
        required: true
    }
});

module.exports = mongoose.model('Book', BookSchema);