const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    courseId:String,
    coursePrice:Number,
    email:String,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports = mongoose.model("Subscription", subscriptionSchema);