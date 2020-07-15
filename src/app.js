// const seeddb = require('./seeds.js')

const { findById } = require('../models/users');
const comments = require('../models/comments');

var express         = require('express'),
    app              = express(),
    bodyParser       =require('body-parser'),
    mongoose         = require('mongoose'),
    Dish             = require('../models/dish'),
    Comments         = require('../models/comments'),
    Posts            = require('../models/dish.js'),
    seeddb           = require('./seeds.js'),
    passport        = require('passport'),
    LocalStrategy   =require('passport-local'),
    User            =require('../models/users'),
    methodoverride  =require('method-override'),
    path            =require('path'),
    mustacheExpress =require('mustache-express'),
    exressSession   =require('express-session')

// mongoose.connect(process.env.MONGO_URL)
mongoose.connect("mongodb://127.0.0.1:27017/cookDiairies-api",{ useNewUrlParser: true , useUnifiedTopology: true ,useFindAndModify:false })
app.use(bodyParser.urlencoded({exdended:true}));

app.engine('mustache',mustacheExpress());
app.set('views','./views')

app.use(express.static('public'))

app.set('view engine' , 'ejs');
// seeddb();


//PASSWORD CONFIGURATION
app.use(require('express-session')({
   secret:"Thisisnotforyou",
   resave:true,
   cookie:{
    maxAge: 8*60*60*1000
   },
   saveUninitialized:true
//    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodoverride('_method'))

app.use(express.static(__dirname + '/public'))

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
function checkCommentOwnership(req,res, next){
    if(req.isAuthenticated()){
        
        Comments.findById(req.params.cmnt_id , (err,found)=>{
            if(err){
                res.redirect('back')
            }else{
                if(found.author.code.equals(req.user._id)){
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
    var desc = req.body.desc,
        veg=req.body.veg,
        serves=req.body.serves,
        duration=req.body.duration,
        cruisine=req.body.cruisine,
        likes=req.body.likes,
        recipe=req.body.recipe,
        ingred=req.body.ingred;



    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newDish = {name:name , image:image , desc:desc , author:author , veg:veg,serves:serves ,cruisine:cruisine ,duration:duration , likes:likes,ingred:ingred,recipe:recipe}
    Dish.create(newDish , (err , elt)=>{
        if(err){
            console.log(err)
        }res.redirect('/dishes') //GET by def 
    })
    
})

app.get('/dishes/new' ,isLoggedin,(req,res)=>{
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
            res.render('edit' , {dish:found})
   
})
})
app.put('/dishes/:id' , checkOwnership, (req,res)=>{
    
    Dish.findByIdAndUpdate(req.params.id ,req.body.dish,(err)=>{
        if(err){
            res.redirect('/dishes')
        }else{
            res.redirect('/dishes/'+req.params.id)
        }        
    })
})

app.delete('/dishes/:id' ,checkOwnership, (req,res)=>{
    Dish.findByIdAndRemove(req.params.id , (err)=>{
        if(err){
            res.redirect('/dishes')
        }else{
            res.redirect('/dishes')
        }        
    })
})

// app.get('/dishes/:id/comments/new',isLoggedin,(req,res)=>{
//     Dish.findById(req.params.id,(err , dish)=>{
//         if(err){console.log(err)}
//         else{
//             res.render('new-comment' , {dish:dish})
//         }
//     })
    
// })
app.post('/dishes/:id/comments', isLoggedin, (req,res)=>{
    Dish.findById(req.params.id,(err , dish)=>{
        if(err){console.log(err);redirect('/dishes')}
        else{
            Comments.create(req.body.comment , (err,cmnt)=>{
                if(err){console.log(err)}
                else{
                    cmnt.author.code = req.user._id
                    cmnt.author.username=req.user.username
                    cmnt.save()
                   
                    dish.comments.push(cmnt) 
                    dish.save()
                   res.redirect('/dishes/' + dish._id )
                }
            })
        }
    })  
})

app.get('/dishes/:id/comments/:cmnt_id/edit',checkCommentOwnership , (req,res)=>{
    Comments.findById(req.params.cmnt_id , (err , found)=>{
        if(err){
            res.redirect('back')
        }else{
            res.render('edit-comment' , {dish_id:req.params.id , cmnt:found})
        }
    })
    
})
app.put('/dishes/:id/comments/:cmnt_id',checkCommentOwnership,(req,res)=>{
    Comments.findByIdAndUpdate(req.params.cmnt_id , req.body.comment, (err)=>{
        if(err){
            res.redirect('back')
        }else{
            res.redirect('/dishes/'+req.params.id)
            // res.render('show',{dish:})
        }
    })
})

app.delete('/dishes/:id/comments/:cmnt_id',checkCommentOwnership ,(req,res)=>{
    comments.findByIdAndRemove(req.params.cmnt_id,(err)=>{
        if(err){res.redirect('back')}
        else{
             res.redirect('/dishes/'+req.params.id)
        }
    })
})

//+++++++++
//Auth Routes

app.get('/register' , function(req,res){
    res.render('register')
})
app.post('/register',(req,res)=>{
    // var newUser = new User({username:req.body.username});
    var newUser = new User({email:req.body.email , username:req.body.username , number:req.body.number});
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

app.post('/login',passport.authenticate("local", 
    {successRedirect:'/dishes',
    failureRedirect:'/login'}) , (req,res)=>{
    
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
