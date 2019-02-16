const express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const port = 3000
const app = express()
app.use(cors())
const api = require('./routes/api')
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api',api)
app.use(session({ secret: 'session secret key' }));
app.get('/',function (req, res){
    
    html = fs.readFileSync('index.html');
    res.write(html)
    res.end()
})  

app.listen(port,function(){
    console.log('server running on Port:'+ port)
})