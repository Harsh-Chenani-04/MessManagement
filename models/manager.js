const mongoose = require('mongoose');
//const bcrypt = require('bcrypt')

const ManagerSchema = new mongoose.Schema({
    ManagerName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Manager',ManagerSchema)
// const password = await bcrypt.hash(admin,12);
// const manager = new Manager({ManagerName:admin,password:password,email:'admin@gmail.com'})

//ManagerName:'manager',email:'manager@gmail.com',password:'manager'