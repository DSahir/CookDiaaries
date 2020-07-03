mongoose = require('mongoose')

var dishSchema = new mongoose.Schema({
    name:String,
    image:String,
    desc:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectID,
            ref:'Comment'
        }
    ]

})
module.exports = mongoose.model("Dish" , dishSchema)
