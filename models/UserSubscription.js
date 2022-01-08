const mongoose = require("mongoose");

const userSubscriptionSchema = mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  subscriptions: {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    amount: Number,
    paymentID: String,
    orderId: String,
  },
});
module.exports = mongoose.model("UserSubscription", userSubscriptionSchema);
