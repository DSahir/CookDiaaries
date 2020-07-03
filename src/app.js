// const seeddb = require('./seeds.js')

const { findById } = require('../models/users');

var express         = require('express'),
    app              = express(),
    bodyParser       =require('body-parser'),
    mongoose         = require('mongoose'),
    Dish             = require('../models/dish.js'),
    Comments         = require('../models/comments'),
    Posts            = require('../models/dish.js'),
    seeddb           = require('./seeds.js'),
    passport        = require('passport'),
    LocalStrategy   =require('passport-local'),
    User            =require('../models/users'),
    methodoverride  =require('method-override')

// mongoose.connect(process.env.MONGO_URL)
mongoose.connect("mongodb://127.0.0.1:27017/cookDiairies-api",{ useNewUrlParser: true , useUnifiedTopology: true  })
app.use(bodyParser.urlencoded({exdended:true}));
app.set('view engine' , 'ejs');
seeddb();


//PASSWORD CONFIGURATION
app.use(require('express-session')({
   secret:"Thisisnotforyou",
   resave:false,
   saveUninitialized:false 
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodoverride('_method'))


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    next();
})

function checkOwnership(req,res, next){
    if(req.isAuthenticated()){
        
        Dish.findById(req.params.id , (err , found)=>{
            if(err){
                res.redirect('/back')
            }else{
                if(found.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect('back')
                }
                
            }
        })
    }else{
        res.redirect('back')
    }

}
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
    req.user
    Dish.find({} , (err , dbdish)=>{
        if(err){
            console.log(err)
        }else{
            res.render('dishes' ,{dishes:dbdish , currentUser:req.user})
    }})
        
    })
    

app.post('/dishes',isLoggedin,(req,res)=>{
    // res.send('this isa post req')
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newDish = {name:name , image:image , desc:desc , author:author}
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
app.get('/dishes/:id' ,isLoggedin,(req,res)=>{
Dish.findById(req.params.id).populate('comments').exec( (er , found)=>{
    if(er){
        console.log(er);
    }else{
        res.render('show' , {dish:found})
    }
})
    
})
app.get('/dishes/:id/edit',checkOwnership,(req,res)=>{

        Dish.findById(req.params.id , (err , found)=>{
            res.render('dishes/edit' , {dish:found})
  
   
})
})
app.put('dishes/:id' , checkOwnership,(req,res)=>{

    findByIdAndUpdate(req.params.id , req.body.dish ,(err , upDish)=>{
        if(err){
            res.redirect('/dishes')
        }else{
            res.redirect('/dishes/'+req.params.id)
        }        
    })
})

app.delete('/dishes/:id' ,checkOwnership, (req,res)=>{
    Dish.findByIdAndRemove(req.params.id) , (err)=>{
        if(err){
            res.redirect('/dishes')
        }else{
            res.redirect('/dishes')
        }        
    }
})

app.get('/dishes/:id/comments/new',isLoggedin,(req,res)=>{
    Dish.findById(req.params.id,(err , dish)=>{
        if(err){console.log(err)}
        else{
            console.log(dish)
            res.render('new-comment' , {dish:dish})
        }
    })
    
})
app.post('/dishes/:id/comments', isLoggedin,(req,res)=>{
    Dish.findById(req.params.if,(err , dish)=>{
        if(err){console.log(err);redirect('/dishes')}
        else{
            Comments.create(req.body.comment , (err,cmnt)=>{
                if(err){console.log(err)}
                else{
                    cmnt.author._id = req.user._id
                    cmnt.author.username=req,user.username
                    cmnt.save()
                   dish.Comments.push(cmnt) 
                   dish.save()
                   res.redirect('/dishes' + dish._id)
                }
            })
            
        }
    })
    
})

app.get('/dishes/:id/comments/:cmnt_id/edit' , (req,res)=>{
    res.send()
})

//+++++++++
//Auth Routes

app.get('/register' , function(req,res){
    res.render('register')
})
app.post('/register',(req,res)=>{
    var newUser = new User({username:req.body.username});
    User.register( newUser, req.body.password , (err , user)=>{
        if(err){console.log(err);return res.render('register')}
        else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/dishes')
            })
        }
    })
})

//========
//login
app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/login' ,passport.authenticate("local" , 
    {successRedirect:'/dishes',
    failureRedirect:'/login'}), (req,res)=>{
    
})
app.get('/logout' , (req,res)=>{
    req.logout()
    res.redirect('/dishes')
})

function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
} 

app.listen(3000 || process.env.PORT , ()=>{
    console.log('Serving Now..')
})


