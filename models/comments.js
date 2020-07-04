var mongoose = require('mongoose')
var User =require('../models/users')

var CmntSchema = mongoose.Schema({
    text:String,
    author:{
        code:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
    username: String
    }
})

module.exports=mongoose.model('Comment' , CmntSchema)