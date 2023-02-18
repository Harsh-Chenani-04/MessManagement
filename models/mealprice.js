const mongoose = require('mongoose');
const {roll_no,StudentName} = require('./student');

const mealprice = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    bf: {
        type: Number, default: 35
    },
    lunch: {
        type: Number, default: 45
    },
    dinner: {
        type: Number, default: 60
    }
})

module.exports = mongoose.model('Mealprice', mealprice)

