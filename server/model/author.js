const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var AuthorSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    dateOfDeath: {
        type: Date
    }
});

module.exports = mongoose.model('Author', AuthorSchema);
