const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String,required:true},
},{collection:'user-data'})

const User = mongoose.model('User',UserSchema)

module.exports = User