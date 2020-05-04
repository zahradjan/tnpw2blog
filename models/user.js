const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'basic',
        enum: ["basic", "admin"]
    },
   /*  accessToken: {
        type: String
    } */

});
const User = mongoose.model('User', userSchema);
 
module.exports = User;