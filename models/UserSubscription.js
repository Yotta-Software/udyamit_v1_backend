const mongoose = require("mongoose");

const userSubscriptionSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  courseId: {
    type:mongoose.Schema.ObjectId,
    ref:'Digital',
    required:true
  },
  cousePrice:Number,
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
},
});
module.exports = mongoose.model("UserSubscription", userSubscriptionSchema);
