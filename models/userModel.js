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
        required:true
    },
    userType:{ type: String,
        required:true
    },
    firstName: String,
    lastName: String,
    phone: String,
    companyName: String,
    website: String ,
    categories: [{
        _id: false,
        name: {
          type: String,
          required: true,
          trim: true
        }
      }],
    languages: [{
        _id: false,
        name: {
          type: String,
          required: true,
          trim: true
        }
      }],
      yearofexp:String,
      highestdegree:String
})

module.exports = mongoose.model('user', UserSchema,'users')