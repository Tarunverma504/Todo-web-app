const mongoose= require('mongoose');
const validator = require('validator');

const registerSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tasks:[{
        type:String,
    }]
})

// creating collections
const userData = new mongoose.model('Data',registerSchema);

module.exports = userData;