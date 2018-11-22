const Order = require('../models/orderModel')
const stringUtil = require('../helper/stringUtil')

var getOrders = async function getOrders(req,res){
    try {
      let email
      if(req.headers['email']){
        email = stringUtil.sanitizeInput(req.headers['email'],true)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"Email Id Is Required"})  
      } 
     
        let orders = await Order.find({'email':email})
        if(orders) {
          res.status(200).send(orders)
        } else {
          res.status(200).send([])
        }
        
    } catch (error) {
      res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
     
  }

  var setOrder = async function setOrder(req,res){
    try {
      let orderInput = []
      let orderData = {} 
      for(let i = 0 ; i< req.body.productList.length ; i++) {
        orderInput[i] = stringUtil.sanitizeInput(req.body.productList[i],true)
      }
      orderData.productList = orderInput
      if(req.headers['email']){
        orderData.email = stringUtil.sanitizeInput(req.headers['email'],true)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"Email Id Is Required"})  
      }
      
      let order = new Order(orderData)
      order.save((error,_id) => {
        try{
           if(error){
            res.status(400).send({"ErrorCode":error.name ,  "ErrorMsg":error._message})
           }else {
            res.status(201).send({_id})
          }
        } catch(error){
          console.log('error in inner try',error)
            res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
        }
       })   
    } catch (error) {
      console.log('error in main try',error)
      res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
     
  }
  
  module.exports = {
      getOrders: getOrders,
      setOrder: setOrder
  }