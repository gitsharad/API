const mongoose = require('mongoose')

const schema = mongoose.Schema

const UserSchema = new schema ({
    email: { type: String,
        unique: true,
        index: true,
        uppercase: true,
        required:true
    } ,
    password: { type: String,
        unique: true,
        required:true
    },
    userType:{ type: String,
        required:true
    },
    firstName: String,
    lastName: String,
    phone: String,
    companyName: String,
    website: String 
})

module.exports = mongoose.model('user', UserSchema,'users')