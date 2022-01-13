const mongoose = require("mongoose");

const jobApplySchema = mongoose.Schema({
  jobId: {
    type:mongoose.Schema.ObjectId,
    ref:'JOB',
    required:true
  },
  email: {
    type: String,
    required: true,
  },
  fatherName: String,
  fname: String,
  gender: String,
  lname: String,
  motherName: String,
  phone: String,
  dob: String, 
  religion: String,
  address: String,
  district: String,
  hn: String,
  pin: String,
  state: String,
  street: String,
  qulification: String,
  degree: String,
  discipline: String,
  pdegree: String,
  pdiscipline: String,
  prefrenceA: String,
  prefrenceB: String,
  prefrenceC: String,
  role: String,
  category: String,
  experience: String,
  expComment: String,
  isJobOutsideIndia: {
    type: Boolean,
    default: false,
  },
  signature: String,
  photo: String,
  idBack: String,
  idFront: String,
  idName: String,
  step: Number,
  isPaid: {
    type: Boolean,
    default: false,
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
 }
});

module.exports = mongoose.model("JobApply", jobApplySchema);
