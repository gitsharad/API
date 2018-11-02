const mongoose = require('mongoose')
const db = 'mongodb://sharad:sharadpawar1989@ds141043.mlab.com:41043/contentwriters_db'

mongoose.connect(db, err => {
    if(err){
        console.error('Error!'+ err)
    } else {
        console.log('connected to mongoDB')
    }
})