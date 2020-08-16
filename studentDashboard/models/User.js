const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true 
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now 
    },
    age:{
        type: String,
    },
    gender: {
        type: String,
    },
    phy: {
        type: String,
    },
    chem: {
        type: String
    },
    math: {
        type: String
    },
    cgpa: {
        type: String
    }
});

module.exports = User = mongoose.model('user', UserSchema);