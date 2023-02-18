const mongoose = require('mongoose');
const moment = require('moment');
const Mealprice = require('./mealprice');
//const mealprice = require('./mealprice');

const studentSchema = new mongoose.Schema({
    StudentName:{
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
    },
    roll_no:{
        type:Number,
        required:true,
        unique:true
    },
    Batch:{
        type:Number,
        required:true,
        min:2019
    },
    no_of_bf:{
        type:Number,
        default: moment().daysInMonth()
    },
    no_of_lunch:{
        type:Number,
        default: moment().daysInMonth()
    },
    no_of_dinner:{
        type:Number,
        default: moment().daysInMonth()
    },
    dues_this_month:{
        type:Number,
        require:true
    },
    currentdues:{
        type:Number,
        default: 0,
        min:0
    },
    duespaid:{
        type:Number,
        default: 0,
        min:0,
    }
})

studentSchema.methods.setduesThisMonth = async function(){
    try{
        const mealprice = await Mealprice.findOne({});
        if(mealprice){
            const {bf,lunch, dinner} = mealprice;
            console.log(mealprice)
            const dues_this_month = (moment().daysInMonth())*(bf+lunch+dinner);
            this.dues_this_month = dues_this_month
            return  this.save();
        }
    }
    catch(err){
        console.log(err)
    }
   
}

const Student= mongoose.model('Student',studentSchema)
module.exports = Student;
 