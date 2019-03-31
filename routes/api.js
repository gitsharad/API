const express = require('express')
const router = express.Router()
const mongoose = require('../helper/db')
const jwt = require('jsonwebtoken')
const product = require('./product')
const Order = require('./orders')
const Sample = require('./samples')
const UserRoute= require('./user')
const paypalGateway= require('./paypalGateway')

router.get('/', (req, res) => {
    res.send('From API Route')
})

//Paypal Apis 
router.post('/pay',(req,res)=>{
paypalGateway.paypalPay(req,res)
})
 
// Product Apis
router.get('/products', (req, res) => {
    product.getProducts(req,res)
})

router.get('/addproduct', (req, res) => {
    product.setProduct(req,res)
})

router.delete('/deleteproduct/:productId', (req, res) => {
    product.deleteProduct(req,res)
})

router.put('/updateproduct/:productId', (req, res) => {
    product.updateProduct(req,res)
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

// Samples Apis 
router.post('/addsamples',verfifyToken,(req,res) => {
    Sample.addSamples(req,res)
})

// User Route APis
router.post('/forgot/:email',verfifyToken,(req,res) =>{
    UserRoute.forgotPassword(req,res)
})

router.get('/reset/:token',verfifyToken,(req,res) =>{
    UserRoute.resetPasswordTokenCheck(req,res)
})

router.post('/reset/:token',verfifyToken,(req,res) =>{
    UserRoute.resetPassword(req,res)
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