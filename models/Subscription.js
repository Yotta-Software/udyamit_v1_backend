const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    courseId:String,
    coursePrice:Number,
    email: {
        type: String,
        required: true,
      },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    isPaid: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model("Subscription", subscriptionSchema);