var mongoose = require('mongoose')

var CmntSchema = mongoose.Schema({
    text:String,
    author:String
})

module.exports=mongoose.model('Comment' , CmntSchema)