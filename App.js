const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
//const Student = require('./models/student')
const studentroutes = require('./routes/studentRoutes')
const adminroutes = require('./routes/adminRoutes')
const managerRoutes = require('./routes/managerRoutes')
const session = require('express-session')
const flash = require('connect-flash')


mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/mess__Management',{useNewUrlParser: true}) // background m mongod chlna chiye tabh hi connect hoga
.then(()=>{
    console.log("mongo connection open")
})
.catch(err =>{
    console.log("oh no mongo error")
    console.log(err)
})

const sessionSecret = {secret:'this is secret',
resave: false, // don't save session if unmodified
saveUninitialized: false,
cookie: {  maxAge: 24 * 60 * 60 * 1000 }  };

app.use(session(sessionSecret))

app.use(methodOverride('_method'));
app.use(express.json());// for parsing application/json
app.use(express.urlencoded({extended: true}));// for parsing application /x-www-form-urlencoded
app.use(express.static(path.join(__dirname, '/public')));

app.use(flash())
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');


app.use('/student',studentroutes);
app.use('/admin',adminroutes);
app.use('/manager',managerRoutes)
app.get('*',(req,res)=>{
    res.send('routes is not defined')
})

app.listen(3000,()=>{
    console.log('listening on port 3000');
})