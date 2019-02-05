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

var setProduct = async function setProduct(req,res){
  try {
    
    let product = new Product(productData)
    product.save((error,data) => {
      try{
         if(error){
          res.status(400).send({"ErrorCode":error.name ,  "ErrorMsg":error._message})
         }else {
          res.status(201).send({data})
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
    getProducts: getProducts,
    setProduct: setProduct
}