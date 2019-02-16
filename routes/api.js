const express = require('express')
const router = express.Router()
const mongoose = require('../helper/db')
const jwt = require('jsonwebtoken')
const product = require('./product')
const Order = require('./orders')
const UserRoute= require('./user')

router.get('/', (req, res) => {
    res.send('From API Route')
})

 
// Product Apis
router.get('/products', (req, res) => {
    product.getProducts(req,res)
})

router.get('/addproduct', (req, res) => {
    product.setProduct(req,res)
})

// Orders Apis
router.post('/addorder',verfifyToken,(req,res) => {
    Order.setOrder(req,res)
})

// Orders Apis
router.put('/updateOrder/:orderId/:subOrderId',verfifyToken,(req,res) => {
    Order.updateOrder(req,res)
})


router.get('/getorders',verfifyToken,(req,res) => {
    Order.getOrders(req,res)
})


// User Route APis

router.post('/forgot/:email',verfifyToken,(req,res) =>{
    UserRoute.forgotPassword(req,res)
})

/* Get Profile Info */
router.get('/profile',verfifyToken, (req, res) => {
UserRoute.getProfileData(req,res)
})

router.post('/profile',verfifyToken,(req,res)=>{
UserRoute.updateProfile(req,res)
})

router.post('/changepassword',verfifyToken,(req,res)=>{
    UserRoute.changePassword(req,res)
})

router.post('/register',async (req,res)=>{
 UserRoute.register(req,res)
})

router.post('/login',async (req,res)=>{
    UserRoute.login(req,res)
})

 function verfifyToken(req,res,next){
     if(!req.headers.authorization){
         return res.status(401).send('Unauthorized Reguest');
     }
     var token = req.headers.authorization.split(' ')[1];
     if(token === null )
     {return res.status(401).send('Unauthorized Reguest');}
     /*var payLoad = jwt.verify(token,'secretKey');
     if(!payLoad){
        return res.status(401).send('Unauthorized Reguest');
     } 
     console.log('hii payload',payLoad)
     req.userId = payLoad.subject;
     */
     jwt.verify(token, 'secretKey', function(err, decoded) {
        // console.log(decoded) // bar
      });
     
     next()
 }
 
module.exports = router