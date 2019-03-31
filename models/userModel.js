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
      highestdegree:String,
      resetPasswordToken: String,
      resetPasswordExpires: Date,
      address:[{
        _id:false,
        address1:{
          type:String,
          require:true,
          trim:true
        },
        address2:{
          type:String,
          require:true,
          trim:true
        },
        country:{
          type:String,
          require:true,
          trim:true
        },
        state:{
          type:String,
          require:true,
          trim:true
        },
        zip:{
          type:Number,
          require:true,
          trim:true
        }
      }],
      CardInfo:{
        cardName:{
          type:String,
          require:true,
          trim:true
        },
        cardNumber:{
          type:String,
          require:true,
          trim:true
        },
        expiration:{
          type:String,
          require:true,
          trim:true
        },
        cvvNumber:{
          type:String,
          require:true,
          trim:true
        }
      }
})

module.exports = mongoose.model('user', UserSchema,'users')