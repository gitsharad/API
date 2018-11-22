const mongoose = require('mongoose')
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const schema = mongoose.Schema

const orderSchema = new schema ({
    _id: {
      default:shortid.generate(),
      type: String
       },
    email: {
      type: String,
      trim:true
    },
    productList: [{
        _id: false,
        productId: {
          type: String,
          required: true,
          trim: true
        },
        qty: {
          type: Number,
          required: true,
          trim: true
        },
        words: {
          type: Number,
          required: true,
          trim: true
        },
        rate: {
            type: Number,
            required: true,
            trim: true
          },
        addon: {
          type: String,
          required: false,
          trim: true
        },
        addonqty:{
          type: Number
        },
        status: {
            type: String,
            required: true,
            trim: true
          }
      }]
})

module.exports = mongoose.model('order', orderSchema,'orders')