const Order = require('../models/orderModel')
const stringUtil = require('../helper/stringUtil')

var getOrders = async function getOrders(req,res){

    try {
      let filters = {}
      if(req.query['email']){
        filters['email'] = stringUtil.sanitizeInput(req.query['email'],true)
      }
      if(req.query['status']){
        filters['status'] = stringUtil.sanitizeInput(req.query['status'],true)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"status Is Required"})  
      } 
      
      Order.aggregate([
            { "$match": filters },
            { "$lookup": 
                       {
                    "from": "samples",
                    "localField": "orderId",
                    "foreignField": "orderId",
                    "as": "orderSamples"
                      }
            }
        ]).exec((err, orders) => {
            if (err) throw err;
            if(orders) {
              res.status(200).send(orders)
            } else {
              res.status(200).send([])
            }
        })
      
       /* let orders = await Order.find(filters)
         */
        
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

      //order input 
      if(req.body['projectDelivery']){
        orderData.projectDelivery = stringUtil.sanitizeInput(req.body['projectDelivery'],false)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"projectDelivery Id Is Required"})  
      }

      if(req.body['projectName']){
        orderData.projectName = stringUtil.sanitizeInput(req.body['projectName'],false)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"projectName Id Is Required"})  
      }
      let billingInfo = orderData['billingInfo']
      delete orderData['billingInfo']
      let order = new Order(orderData)
      
      order.save((error,_id) => {
        try{
           if(error){
             console.log('sdjflksdjflksdjf',error)
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

  var updateOrder = async function updateOrder(req,res){
    try {
      let orderId = ''
      let orderStatus = ''
      let subOrderId =''
      
      if(req.params['orderId']){
        orderId = stringUtil.sanitizeInput(req.params['orderId'],false)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"OrderId Is Required"})  
      }
      if(req.params['subOrderId']){
        subOrderId = stringUtil.sanitizeInput(req.params['subOrderId'],false)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"SuborderId Is Required"})  
      }

      if(req.query['status']){
        orderStatus = stringUtil.sanitizeInput(req.query['status'],true)
      } else {
        return res.status(400).send({"ErrorCode":"Invalid Param Error" ,  "ErrorMsg":"Status Is Required"})  
      }
      query = { 'orderId':orderId, "productList": { $elemMatch: { subOrderId:  subOrderId } } }
      upsertData = {'productList.$.status': orderStatus}
      var updateOrderData = await Order.updateOne(query, { $set: upsertData })
      if(updateOrderData){
        res.status(201).send({updateOrderData})
      } else {
        console.log('error in inner try',error)
        res.status(400).send({"ErrorCode": "400" ,  "ErrorMsg":"something went wrong" })
      }
     
    } catch (error) {
      console.log('error in main try',error)
      res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
     
  }
  
  module.exports = {
      getOrders: getOrders,
      setOrder: setOrder,
      updateOrder: updateOrder
  }