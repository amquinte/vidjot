const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const IdeaSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: String,
        default: Date.now
    }
});

mongoose.model('users', UserSchema);