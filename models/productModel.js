const mongoose = require('mongoose')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const schema = mongoose.Schema

const ProductSchema = new schema ({
    productName: { type: String,
        unique: true,
        index: true,
        uppercase: true,
        required:true
    } ,
    _id: {
        default:shortid.generate(),
        type: String
    },
    rate: { type: Number,
        required:true
    },
    type:{
         type:String ,
         required:true 
  }
})

module.exports = mongoose.model('product', ProductSchema,'products')