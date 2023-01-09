const mongoose = require('mongoose');

const studentSchema=new mongoose.Schema({
    name : String,
    email : String,
    phoneNumber : Number,
    Age : Number,
    isStudent : Boolean,
    highestQualification : String,
    interests : Array   
})

module.exports=mongoose.model('Student',studentSchema,"Student");