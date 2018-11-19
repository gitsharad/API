const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('../helper/db')
const jwt = require('jsonwebtoken')
const stringUtil = require('../helper/stringUtil')
const updateUtil = require('../helper/crudutil')
const nodemailer = require('nodemailer')
 var transporter = nodemailer.createTransport({
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
  }; 
 
  
router.get('/', (req, res) => {
    res.send('From API Route')
})
/* Get Profile Info */
router.get('/profile', (req, res) => {
try {
  var email = stringUtil.sanitizeInput(req.query.email,true)
    User.findOne({email: email}).exec(function(err,userProfile){
       if(err){
        res.status(400).send(err)
       }
       res.status(201).send(userProfile)
   })
} catch(error){
    res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
}
})

router.post('/profile',(req,res)=>{
    try{
    var userData = stringUtil.sanitizeInput(req.body,true)
    var email = stringUtil.sanitizeInput(req.body['email'],true)
    
    User.findOneAndUpdate({email: email}, {$set:userData},function(err, doc){
        if(err){
            res.status(401).send({"ErrorCode":err.code ,  "ErrorMsg":err.errmsg})
        }
    
        res.status(200).send({email})
    });
} catch(error){
    console.log('error',error)
    res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
}
})

router.post('/changepassword',(req,res)=>{
    changePassword(req,res)
})

var changePassword = async function changePassword(req,res){
    var userData =stringUtil.sanitizeInput(req.body,false)
    try {
      let user =  await User.findOne({email:userData.email}) 
       if(user === null){
        res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Email"})
       }
       else {
        if( user.password  !== userData.currentPassword){
            res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Current Password"})              
         } else { 
             try{
             var updateData = {"password": userData.newPassword}
             var returnData = await updateUtil.updateData(updateData,{"email": userData.email})
             res.status(200).send(returnData)
             } catch(err){
                 console.log('err',err)
                 res.status(500).send({"ErrorCode": err.code ,  "ErrorMsg": err.errmsg })
             }
         }
     }
    
    } catch(error){
        res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
}


router.post('/register',(req,res)=>{
   var userData = req.body
   var user = new User(userData)
  
   user.save((error,registeredUser) => {
    try{
       if(error){
        res.status(401).send({"ErrorCode":error.code ,  "ErrorMsg":error.errmsg})
       }else {
           var payload = {subject: user._id}
           var token = jwt.sign(payload, 'secretkey')
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
    var userData = req.body
    
    User.findOne({email:userData.email}, (error, user) => {
        try{
        if(error){
            res.status(500).send('something went wrong')
        } else{
            if(!user){
                res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Email"})
            } else {
               if( user.password !== userData.password){
                   res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Password"})              
                } else {
                    
                       transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                console.log(error);
                                } else {
                                console.log('mail gela re')
                                   
                                }
                                var payload = {subject: user._id}
                                var token = jwt.sign(payload, 'secretkey')         
                                res.status(200).send({"token":token, "userType":user.userType})
                            }); 
                   
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
     var token = req.headers.authorization.split(' ')[1];
     if(token === null )
     {return res.status(401).send('Unauthorized Reguest');}
     var payLoad = jwt.verify(token,'secretKey');
     if(!payLoad){
        return res.status(401).send('Unauthorized Reguest');
     }
     req.userId = payLoad.subject;
     next()
 }

 
 

module.exports = router