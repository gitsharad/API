const express = require('express')
const router = express.Router()
const mongoose = require('../helper/db')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const stringUtil = require('../helper/stringUtil')
const nodemailer = require('nodemailer');

/* var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ssspawar25@gmail.com',
      pass: 'SharadPawar@1989'
    }
  });
  
  var mailOptions = {
    from: 'ssspawar25@gmail.com',
    to: 'ssspawar25@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  }; */
  
  
router.get('/', (req, res) => {
    res.send('From API Route')
})
/* Get Profile Info */
router.get('/profile', (req, res) => {
   let email = stringUtil.sanitizeInput(req.query.email)
    User.findOne({email:req.query.email}).exec(function(err,userProfile){
       if(err){
        res.status(400).send(err)
       }
    res.status(201).send(userProfile)
   })
})

/*router.post('/profile',(req,res)=>{
    let userData = stringUtil.sanitizeInput(req.body)
    let user = new User(userData)
    let email = stringUtil.sanitizeInput(req.headers['email'])
    
    user.findAndUpdate({email:email},userData)

 }) */

router.post('/register',(req,res)=>{
   let userData = req.body
   let user = new User(userData)
  
   user.save((error,registeredUser) => {
    try{
       if(error){
        res.status(401).send({"ErrorCode":error.code ,  "ErrorMsg":error.errmsg})
       }else {
           let payload = {subject: user._id}
           let token = jwt.sign(payload, 'secretkey')
         /*  transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
                res.status(201).send({token})
            }
          }); */
          res.status(201).send({token})
           
       }
    } catch(error){
        res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
   })
})

router.post('/login',(req,res)=>{
    let userData = req.body
    
    User.findOne({email:userData.email}, (error, user) => {
        try{
        if(error){
            res.status(500).send('something went wrong')
        } else{
            if(!user){
                res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Email"+ user.email })
            } else {
               if( user.password !== userData.password){
                   res.status(401).send('invalid password')               
                } else {
                    let payload = {subject: user._id}
                    let token = jwt.sign(payload, 'secretkey')         
                    res.status(200).send({token})
                }
            }
        }
    } catch(error){
        res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
    })

 })

 function verfifyToken(req,res,next){
     if(!req.headers.authorization){
         return res.status(401).send('Unauthorized Reguest');
     }
     let token = req.headers.authorization.split(' ')[1];
     if(token === null )
     {return res.status(401).send('Unauthorized Reguest');}
     let payLoad = jwt.verify(token,'secretKey');
     if(!payLoad){
        return res.status(401).send('Unauthorized Reguest');
     }
     req.userId = payLoad.subject;
     next()
 }
 

module.exports = router