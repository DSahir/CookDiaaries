// const seeddb = require('./seeds.js')

var express = require('express'),
     app = express(),
     bodyParser =require('body-parser'),
     mongoose = require('mongoose'),
     Dish = require('../models/dish.js'),
     Comments = require('../models/comments'),
     Posts = require('../models/dish.js'),
    seeddb = require('./seeds.js')

seeddb();

// mongoose.connect(process.env.MONGO_URL)
mongoose.connect("mongodb://127.0.0.1:27017/cookDiairies-api",{ useNewUrlParser: true , useUnifiedTopology: true  })
app.use(bodyParser.urlencoded({exdended:true}));
app.set('view engine' , 'ejs');


// Dish.create({
//     name: "Pasta" ,
//     image:"https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
// }, function(err , dish){
//     if(err){
//         console.log(err)
//     }else{
//         console.log("Dish created")
//         console.log(dish)
//     }
// })

var dishes = [
    {name: "Noodles" , image:"https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
    {name: "Pizza" , image:"https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Pancakes" , image:"https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
]
app.get('/' , (req, res)=>{
    res.render('landing')
});
app.get('/dishes',(req,res)=>{
    Dish.find({} , (err , dbdish)=>{
        if(err){
            console.log(err)
        }else{
            res.render('dishes' ,{dishes:dbdish})
    }})
        
    })
    

app.post('/dishes',(req,res)=>{
    // res.send('this isa post req')
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newDish = {name:name , image:image , desc:desc}
    Dish.create(newDish , (err , elt)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/dishes') //GET by def 
    })
    
})

app.get('/dishes/new' , (req,res)=>{
    res.render('new')
})
app.get('/dishes/:id' , (req,res)=>{
Dish.findById(req.params.id).populate('comments').exec( (er , found)=>{
    if(er){
        console.log(er);
    }else{
        res.render('show' , {dish:found})
    }
})
    
})

app.get('/dishes/:id/comments/new',(req,res)=>{
    Dish.findById(req.params.id,(err , dish)=>{
        if(err){console.log(err)}
        else{
            console.log(dish)
            res.render('new-comment' , {dish:dish})
        }
    })
    
})
app.post('/dishes/:id/comments',(req,res)=>{
    Dish.findById(req.params.if,(err , dish)=>{
        if(err){console.log(err);redirect('/dishes')}
        else{
            Comments.create(req.body.comment , (err,cmnt)=>{
                if(err){console.log(err)}
                else{
                   dish.Comments.push(cmnt) 
                   dish.save()
                   res.redirect('/dishes' + dish._id)
                }
            })
            
        }
    })
    
})


app.listen(3000 || process.env.PORT , ()=>{
    console.log('Serving Now..')
})


