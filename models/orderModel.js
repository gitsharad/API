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
    projectDelivery:{
      type: String,
      trim:true
    },
    projectName:{
      type: String,
      trim:true
    },
    productList: [{
        _id: false,
        productName: {
          type: String,
          required: true,
          trim: true
        },
        qty: {
          type: Number,
          required: true,
          trim: true
        },
        rate: {
            type: Number,
            required: true,
            trim: true
          },
        otherInfo:[
           {
            name:{
              type: String,
              required: true,
              trim: true
            },
            words: {
              type: Number,
              required: true,
              trim: true
            },
            addonInfo: [
              {
                name:{
                type: String,
                required: true,
                trim: true
              },
              value:{
                type: String,
                required: true,
                trim: true
              }
            }
            ]
           }
         ],
        status: {
            type: String,
            required: true,
            trim: true
          }
      }]
})

module.exports = mongoose.model('order', orderSchema,'orders')