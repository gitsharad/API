const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
// const db = 'mongodb://sharad:sharadpawar1989@ds143262.mlab.com:43262/rentdb'
const db = 'mongodb://sharad:sharadpawar1989@ds141043.mlab.com:41043/contentwriters_db'
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
mongoose.connect(db, err => {
    if(err){
        console.error('Error!'+ err)
    } else {
        console.log('connected to mongoDB')
    }
})
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

router.post('/register',(req,res)=>{
   let userData = req.body
   let user = new User(userData)
  
   user.save((error,registeredUser) => {
       if(error){
           console.error(error)
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
   })
})

router.post('/login',(req,res)=>{
    let userData = req.body
    User.findOne({email:userData.email}, (error, user) => {
        if(error){
            console.log(error)
            res.status(500).send('something went wrong')
        } else{
            if(!user){
                res.status(401).send('invalid email')
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