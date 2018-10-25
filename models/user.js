const mongoose = require('mongoose')

const schema = mongoose.Schema

const UserSchema = new schema ({
    email: String ,
    password: String,
    userType: String 
})

module.exports = mongoose.model('user', UserSchema,'users')