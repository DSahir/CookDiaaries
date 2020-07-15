var mongoose = require('mongoose')
var passwordLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        
    },
    number  :{type:Number},
    username:{type:String},
    password:{type:String}
})

UserSchema.plugin(passwordLocalMongoose)
module.exports = mongoose.model('User' , UserSchema)




