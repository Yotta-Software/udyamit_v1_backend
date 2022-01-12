const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema({
    name:String,
    reason:String,
    coursePrice:Number,
    email:String,
    number:Number,
    message:String,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model("Contactus", contactusSchema);