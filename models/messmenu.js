const mongoose = require('mongoose');

const MessMenuSchema = new mongoose.Schema({
    day:String,
    b1:String,
    b2:String,
    b3:String,
    l1:String,
    l2:String,
    l3:String,
    d1:String,
    d2:String,
    d3:String,
    
})







const Messmenu = mongoose.model('Messmenu', MessMenuSchema);

module.exports = Messmenu;