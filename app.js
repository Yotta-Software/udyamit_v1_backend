require("dotenv").config();
const express = require("express");
fileupload=require('express-fileupload');
const cors = require("cors");
const path = require("path");
const morgan = require('morgan');
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
 // set static folder
 app.use(express.static('public'))
 // file uploading
 app.use(fileupload());
require("./db");
app.use(morgan('tiny'));
const errorHandler=require('./middelware/error');


// app.get('/',(req, res) => {
//   res.send('API is available');
// })
const auth = require('./routes/auth');
app.use("/api", require("./routes/dataRoutes"));
app.use('/api/v1/auth',auth);
app.use(errorHandler);


const JobApply = require("./models/JobApply.js");
const Contactus = require("./models/Contactus.js");
const User = require("./models/User.js");
// get all users 
// GET all users
app.get('/users',async(req,res)=>{
    const users=await User.find({});
    res.status(200).json({success:true,users});
})
app.post('/applyjob',async (req, res)=>{
    try{
        const {jobId,user}=req.body;
        const isApplied = await JobApply.findOne({jobId,user,isPaid:true});
        if(isApplied){
          return  res.status(408).json({success:false,message:"You already had applied for this job !"});
        }
        // removing all unPaid jobs
        await JobApply.deleteMany({isPaid:false});
        const application= await JobApply.create(req.body);
        console.log('-------- new application ---------------',application);
        res.status(201).json({success:true,application});
    } catch (error) {
        res.status(500).json({success:false,message:error})
    }
});
//================================================================================================================================
app.post('/uploads',(req,res)=>{
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
      if(!req.files){
        return  res.status(400).json({status:false,msg:"Please upload an file"});    
    }
    const file=req.files.file;
    // Checking file size unit is bytes,MAX_FILE_UPLOAD = 1 Megabyte which is equal to 10,00,000 bytes
    if(file.size>process.env.MAX_FILE_UPLOAD_SIZE){
        return res.status(400).json({status:false,msg:"Please upload an image less than 1 Megabyte"})
    }
    // Creating custom file name
    file.name=`photo_${makeid(5)}${path.parse(file.name).ext}`;
    file.mv(`./public/uploads/${file.name}`,async err=>{
            if(err){
                console.error(err);
                return res.status(500).json({status:false,msg:"Problem with file upload"})
            }
            res.status(200).json({success:true,data:{
                name:file.name,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.name}`
            }});
    })
  })
  // get all applications
  // GET /applications
  app.get('/applications',async function(req,res){
      const applications= await JobApply.find().sort({$natural:-1})
      res.status(200).json({sucess:true,applications});
  })
  const Subscription=require('./models/Subscription');
  app.post('/subscription',async function(req,res){
      try{
        const isSubscribed= await Subscription.findOne({
          courseId: req.body.courseId,
          user:req.body.user,
          isPaid:true
        })
        if(isSubscribed){
          return res.status(408).json({
            success: false,message:' you are already enrolled in this course'
          })
        }
        // removing unPaid subscriptions
        await Subscription.deleteMany({isPaid:false});
        const subscription= await Subscription.create({...req.body,isPaid:false});
       // console.log('-------- new subscription ---------------',subscription);
        res.status(200).json({
            success: true,
            subscription
        })
      }catch(err){
         res.status(500).json({success: false, message:err})
      }
  })
  // get all subscriptions
  // GET /subscriptions
  app.get('/subscriptions',async function(req,res){
    try{
      const subscription= await Subscription.find({}).sort({$natural:-1});
      res.status(200).json({
          success: true,
          subscription: subscription
      })
    }catch(err){
       res.status(500).json({success: false, message:err})
    }
})
app.post('/contactus',async(req, res)=>{
  try{
    const message = await Contactus.create(req.body);
    res.status(200).json({success:true, message:message});
  }catch(err){
      res.status(500).json({message: err.message});
  }
})
// get all message 
// GET /contactus
app.get('/contactus',async (req, res)=>{
  const messages = await Contactus.find();
  res.status(200).json({success:true, messages});
})
app.get('/download',(req,res)=>{
  res.download('./Udyamit.pdf');
})
app.post('/pay/:service/success',async (req,res)=>{
  if(req.params.service==="course"){
      let course = await Subscription.findOne({email:req.body.email}).sort({$natural:-1});
      course = await Subscription.findByIdAndUpdate(course._id,{isPaid:true},{new:true});
      await Subscription.deleteMany({isPaid:false});
     // res.status(200).json(course);
      res.redirect('https://udyamit.in/digitalLearning');
      
  }
  if(req.params.service==="applyjob"){
      //.sort({$natural:-1});{"email": "abhiwebdev2718@gmail.com"}
      let application = await JobApply.findOne({email:req.body.email}).sort({$natural:-1});
      application = await JobApply.findByIdAndUpdate(application._id,{isPaid:true},{new:true});
      await JobApply.deleteMany({isPaid:false});
      //res.status(200).json(application);
      res.redirect('https://udyamit.in/creers');
 }
})
app.post('/pay/fail',(req,res)=>{
  res.send('<p>Payment fail ,Please try again!</p>');
})

app.use(express.static(path.resolve(__dirname, './build')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});
app.listen(8080,()=>console.log("listening on port 8080"));
module.exports = app;
