const mongoose = require('mongoose')

const schema = mongoose.Schema

const ProductSchema = new schema ({
    productName: { type: String,
        unique: true,
        index: true,
        uppercase: true,
        required:true
    } ,
    rate: { type: Number,
        required:true
    },
    type:{
         type:String ,
         required:true 
  }
})

module.exports = mongoose.model('product', ProductSchema,'products')