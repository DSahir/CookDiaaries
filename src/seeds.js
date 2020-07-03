var mongoose = require('mongoose')
var Dish = require('../models/dish')
var Comments = require('../models/comments')

var data = [
    {
        name : 'Khher',
        image:"",
        desc:"nommmmmm"
    },
    {
        name : 'jalebi',
        image:"",
        desc:"nommmmmm"
    },
    {
        name : 'oats',
        image:"",
        desc:"nommmmmm"
    }
    
]

function seeddb(){
Dish.remove({} , (er)=>{
    if(er){
        console.log(er)
    }console.log("removed Dish")
    data.forEach((seed)=>{
        Dish.create(seed , (er,data)=>{
            if(er){console.log(er)}
            else{
                console.log('Added a dish')
                Comments.create({
                    text:"Add more suger",
                    author:"anu"
                },(er,cmnt)=>{
                    if(er){console.log(er)}
                    else{
                        data.comments.push(cmnt)
                        data.save()
                        console.log(cmnt)

                    }
                })
            }
        })
    })
})
}

module.exports = seeddb





