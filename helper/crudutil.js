
const User = require('../models/userModel')
const stringUtil = require('../helper/stringUtil')
async function  updateData(updateData,conditionData){
    try {
        User.findOneAndUpdate(conditionData, updateData,function(err, doc){
            if(err){
                console.log('err',err)
                throw err
            }
    });
    } catch(error){
        console.log('error',error)
        throw error
    }

    return conditionData
}

module.exports = {
    updateData
}
    