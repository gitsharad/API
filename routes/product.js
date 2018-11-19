const Product = require('../models/productModel')
const stringUtil = require('../helper/stringUtil')

var getProducts = async function getProducts(req,res){
  try {
      let params = stringUtil.sanitizeInput(req.query)
      let products = await Product.find(params)
      if(products){
        res.status(200).send(products)
      } else{
        res.status(200).send([])
      }
      
  } catch (error) {
    res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
  }
   
}

module.exports = {
    getProducts: getProducts
}