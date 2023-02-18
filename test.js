const Admin = require('./models/Admin');
const mongoose = require('mongoose')
//const Student = require('./models/student')
const studentroutes = require('./routes/studentRoutes')
const session = require('express-session')
const flash = require('connect-flash');
const { func } = require('joi');
const Mealprice = require('./models/mealprice')
const bcrypt = require('bcrypt')
const Manager = require('./models/manager')
const Messmenu = require('./models/messmenu')

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/mess__Management',{useNewUrlParser: true}) // background m mongod chlna chiye tabh hi connect hoga
.then(()=>{
    console.log("mongo connection open")
})
.catch(err =>{
    console.log("oh no mongo error")
    console.log(err)
})


//const Admin = mongoose.model('Admin',AdminSchema);

// async function createAdmin(){
//     try{
//         const password = 'password',AdminName = 'name' , email = 'admin@gmail.com';
//         const admin = new Admin({AdminName,email,password});
//         await admin.save()
//         if(admin){
//             console.log(admin)
//         }
//     }
//     catch(err){
//         console.log(err)
//     }
// }
// createAdmin();

// async function setmealprice(){
//     const admin = await Admin.findOne();
//     console.log(admin);
//     const mealprice = new Mealprice({id:admin._id,bf:35,lunch:55,dinner:60});
//     console.log(mealprice);
//     await mealprice.save();
// }
// setmealprice()

// async function newManager(){
//     const password = 'manager',ManagerName = 'manager',email = 'manager@gmail.com';
//     const body = {ManagerName,email,password}
    
//     const hash = await bcrypt.hash(password,10);
//     const manager = new Manager({ManagerName:ManagerName,email:email,password:hash});
//     //manager.password = hash;

//     await manager.save();
// }

// newManager()

//db.dogs.insert([ {name:"bob",age:14,breed:"golden"}, {name:"boxer",age:3,breed:"chihuahua",catFriendly: true}})

// async function setmessmenu(){
//    //const messmenu = New Messmenu({})
//    await Messmenu.insertMany([
//      {day:"Sunday",b1:'Rava Dhosa',b2:'Kheer',b3:'Milk/Tea/Coffee',l1:'Patta Gobhi,Daal Fry',l2:'Soyabean',l3:'Rice, Chapati ,Achaar',d1:'Mix Veg,Arhar Daal',d2:'Kheer',d3:'Rice, Chapati ,Achaar'},
//      {day:"Monday",b1:'Pav Bhaji',b2:'Halwa',b3:'Milk/Tea/Coffee',l1:'Parval , Moong Daal',l2:'Dahi',l3:'Rice, Chapati ,Achaar',d1:'Malai Paneer,Daal',d2:'Rasgulla',d3:'Rice, Chapati ,Achaar'},
//      {day:"Tuesday",b1:'Bread Jam',b2:'Apple/Banana',b3:'Milk/Tea/Coffee',l1:'Chhole ,Bhindi Aloo',l2:'Papad',l3:'Rice, Chapati ,Achaar',d1:'Kadai Paneer',d2:'Custard',d3:'Rice, Chapati ,Achaar'},
//      {day:"Wednesday",b1:'Allo Paratha',b2:'Chhole',b3:'Milk/Tea/Coffee',l1:'Bengan, Mix Daal',l2:'Salad',l3:'Rice, Chapati ,Achaar',d1:'Chicken Masala/Matar Paneer',d2:'Gulab Jamun',d3:'Rice, Chapati ,Achaar'},
//      {day:"Thursday",b1:'Uttapam',b2:'Sambhar',b3:'Milk/Tea/Coffee',l1:'Matar Aloo,Aloo Paratha',l2:'Dahi',l3:'Rice, Chapati ,Achaar',d1:'Fish/Palak Paneer',d2:'Gaajar Halwa',d3:'Rice, Chapati ,Achaar'},
//      {day:"Friday",b1:'Pudi Aloo',b2:'Chana Fry',b3:'Milk/Tea/Coffee',l1:'Kashmiri Pulao',l2:'Palak',l3:'Rice, Chapati ,Achaar',d1:'Egg Bhurji/Mix Veg',d2:'Paneer Pakoda',d3:'Rice, Chapati ,Achaar'},
//      {day:"Saturday",b1:'Chowmein',b2:'Sweetcorn',b3:'Milk/Tea/Coffee',l1:'Mix Veg,Black Daal',l2:'Kajoo Katli',l3:'Rice, Chapati ,Achaar',d1:'Kadhai Chicken/Kadai Paneer',d2:'Ice Cream',d3:'Rice, Chapati ,Achaar'},
//    ])
// }

// setmessmenu()

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() +1  ;
const daysInMonth = new Date(year, month+1, 0).getDate();

console.log(daysInMonth)