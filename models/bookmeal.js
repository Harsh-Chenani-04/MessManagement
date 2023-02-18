const mongoose = require('mongoose');
const {roll_no,StudentName} = require('./student');

const bookingSchema = new mongoose.Schema({
    s_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    name:String,
    roll_no:Number,
    Batch:Number,
    startdate: {
        type: String,
        required: true
    },
    enddate: {
        type: String,
        required: true,
        
    },
    bf: {
        type: Number, default: 1
    },
    lunch: {
        type: Number, default: 1
    },
    dinner: {
        type: Number, default: 1
    },

})

module.exports = mongoose.model('Booking', bookingSchema)