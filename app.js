var express = require('express')
var app = express();
var bodyParser =require('body-parser');
app.use(bodyParser.urlencoded({exdended:true}));

app.set('view engine' , 'ejs');

var dishes = [
    {name: "Noodles" , image:"https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
    {name: "Pizza" , image:"https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Pancakes" , image:"https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
]
app.get('/' , (req, res)=>{
    res.render('landing')
});
app.get('/dishes',(req,res)=>{

    res.render('dishes' ,{dishes:dishes});
});

app.post('/dishes',(req,res)=>{
    // res.send('this isa post req')
    var name = req.body.name;
    var image = req.body.image;
    var newDish = {name:name , image:image}
    dishes.push(newDish);
    res.redirect('/dishes') //GET by def 
})

app.get('/dishes/new' , (req,res)=>{
    res.render('new')
})

app.listen(3000 , ()=>{
    console.log('Serving Now..')
})


