const UserModel = require('../models/userModel')

var crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const logger = require('../helper/logger/logger')
const loggerUtil = require('../helper/logger/loggerUtil')
const stringUtil = require('../helper/stringUtil')
const updateUtil = require('../helper/crudutil')
const nodemailer = require('nodemailer')
const async = require('async')

var transporter = nodemailer.createTransport({
    host: 'mail.globalcontentwriters.com',
    port: 587,
    secure: false,
    auth: {
      user: 'support@globalcontentwriters.com',
      pass: 'prashant@1234'
    },
    tls:{
        rejectUnauthorized:false
    }
  });
  
  var mailOptions = { 
    from: '"GCW" <support@globalcontentwriters.com>',
    to: 'ssspawar25@gmail.com',
    subject: 'Sending Email using Node.js',
    text: `<p>You have successfully Register With GCW.</p>`
  }; 

// Forgot Password
function forgotPassword(req,res){
    let email = ''
    if(req.params['email']){
        email = stringUtil.sanitizeInput(req.params['email'],true)
    }
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          UserModel.findOne({ email: email }, function(err, user) {
            if (!user) {
             // req.flash('error', 'No account with that email address exists.');
             //  return res.redirect('/forgot');
             return res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"No account with that email address exists."})
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
         
          mailOptions.to = user.email
          mailOptions.subject = 'Password Reset'
          mailOptions.text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'

          transporter.sendMail(mailOptions, function(err) {
            console.log('error',err)
            logger.info('mail sent Successfully',user.email)
          });
        }
      ], function(err) {
        if (err) 
        {
            console.log('error',err)
            logger.error(loggerUtil.createLoggerMessage(module, err))
            return next(err);
        }
        
      });
    res.status(200).send({'email':email})
}

function resetPasswordTokenCheck(req,res){
    UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        
        if (!user) {
          res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Password reset token is invalid or has expired."})
        }
       res.status(200).send({"token":req.params.token})
      });
}

 function resetPassword(req,res){
    async.waterfall([
          function(done) {
          UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) {
            
            if (!user) {
               return  res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Password reset token is invalid or has expired."})
            }
            if(req.body.newPassword !== req.body.confirmPassword){
               return  res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"New Password and Confirm Password Not Same."})
            }
            
            let hashPass =  await hashPassword(req.body.newPassword)
            user.password = hashPass;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
    
            user.save(function(err) {
             // req.logIn(user, function(err) {
                done(err, user);
             // });
            });
          });
        },
        function(user, done) {
          mailOptions.to = user.email
          mailOptions.subject = 'Your password has been changed'
          mailOptions.text = 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          res.status(200).send({"token":req.params.token})
          transporter.sendMail(mailOptions, function(err) {
            done(err);
          });
        }
      ], function(err) {
        console.log('error',err)
        logger.error(loggerUtil.createLoggerMessage(module, err))
        
      });
     
}



//Login Api

function login(req,res){
    var userData = req.body
    
    UserModel.findOne({email:userData.email}, async (error, user) => {
        try{
        if(error){
            res.status(500).send('something went wrong')
        } else{
            if(!user){
                res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Email"})
            } else {

                var compareResult = await checkUser(user.password,userData.password)
                if(!compareResult){
                    res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Password"})              
                 } else {
                             let payload = {subject: user._id}
                             let token = jwt.sign(payload, 'secretkey')         
                             logger.info("Login Successfully done.")
                             res.status(200).send({"token":token, "userType":user.userType})    
                 }
            }
        }
    } catch(error){
        console.log('error',error)
        logger.error(loggerUtil.createLoggerMessage(module, error))
        res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
    })
}

// Register API

async function register(req,res){
    var userData = req.body
    var hashPass =  await hashPassword(req.body.password)
    req.body.password = hashPass
    var user = new UserModel(userData)
    user.save((error,registeredUser) => {
     try{
        if(error){
         res.status(401).send({"ErrorCode":error.code ,  "ErrorMsg":error.errmsg})
        }else {
            var payload = {subject: user._id}
            var token = jwt.sign(payload, 'secretkey')
            
            mailOptions.to = userData.email
           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
             } else {
                 res.status(201).send({token})
             }
           });
            
        }
     } catch(error){
        console.log('error',error)
        logger.error(loggerUtil.createLoggerMessage(module, error))
        
         res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
     }
    })
}

//Change Password APi

 async function changePassword(req,res){
    var userData =stringUtil.sanitizeInput(req.body,false)
    try {
      let user =  await UserModel.findOne({email:userData.email}) 
       if(user === null){
        res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Email"})
       }
       else {
       
         var compareResult = await checkUser(user.password,userData.currentPassword)
                if(!compareResult){
                    res.status(401).send({"ErrorCode": "401" ,  "ErrorMsg":"Invalid Password"})              
                 } else {
                    try{
                        var hashPass =  await hashPassword(userData.newPassword)
                        var updateData = {"password": hashPass}
                        var returnData = await updateUtil.updateData(updateData,{"email": userData.email})
                        res.status(200).send(returnData)
                        } catch(err){
                            console.log('err',err)
                            res.status(500).send({"ErrorCode": err.code ,  "ErrorMsg": err.errmsg })
                        } 
                 }
     }
    
    } catch(error){
        console.log('error',error)
        logger.error(loggerUtil.createLoggerMessage(module, error))
        
        res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
}

function updateProfile(req,res){
    try{
        var userData = stringUtil.sanitizeInput(req.body,true)
        var email = stringUtil.sanitizeInput(req.body['email'],true)
        
        UserModel.findOneAndUpdate({email: email}, {$set:userData},function(err, doc){
            if(err){
                res.status(401).send({"ErrorCode":err.code ,  "ErrorMsg":err.errmsg})
            }
        
            res.status(200).send({email})
        });
    } catch(error){
        console.log('error',error)
        logger.error(loggerUtil.createLoggerMessage(module, error))
        res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
    }
}

function getProfileData(req,res){
    try {
        var email = stringUtil.sanitizeInput(req.query.email,true)
          UserModel.findOne({email: email}).exec(function(err,userProfile){
             if(err){
              res.status(400).send(err)
             }
             res.status(201).send(userProfile)
         })
      } catch(error){
        console.log('error',error)
        logger.error(loggerUtil.createLoggerMessage(module, error))
        res.status(500).send({"ErrorCode": "500" ,  "ErrorMsg":"Internal Server Error" })
      }
}

async function checkUser(hash,password) {
    return await bcrypt.compare(password, hash);
}

async function hashPassword(myPlaintextPassword){
    var saltRounds = 10
    return bcrypt.hash(myPlaintextPassword, saltRounds)
}


module.exports = {
    forgotPassword,
    login,
    register,
    changePassword,
    updateProfile,
    getProfileData,
    resetPasswordTokenCheck,
    resetPassword
}