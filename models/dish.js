mongoose = require('mongoose')

var dishSchema = new mongoose.Schema({
    name:{type:String},
    image:{type:String},
    veg:{type:String},
    serves:{type:Number},
    cruisine:{type:String},
    desc:{type:String},
    duration:{type:Number},
    likes:{type:Number},
    ingred:{type:String},
    recipe:{type:String},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectID,
            ref:'User'
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectID,
            ref:'Comment'
        }
    ]

})
module.exports = mongoose.model("Dish" , dishSchema)
