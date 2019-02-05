const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const port = 3000
const app = express()
app.use(cors())
const api = require('./routes/api')
app.use(bodyParser.json())
app.use('/api',api)

app.get('/',function (req, res){
    
    html = fs.readFileSync('index.html');
    res.write(html)
    res.end()
})  

app.listen(port,function(){
    console.log('server running on Port:'+ port)
})