require("dotenv").config();
const express = require("express");
const multer = require("multer"),
fileupload=require('express-fileupload');
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
 // set static folder
 app.use(express.static('public'))
 // file uploading
 app.use(fileupload());
require("./db");
// // const { initializeApp } = require("firebase-admin/app");
// const firebaseConfig = require("./config.js");
// const admin = require("firebase-admin");
// global.firebaseApp = admin.initializeApp({
//   credential: admin.credential.cert(firebaseConfig),
// });
//const { register } = require("./apis/users/register.js");
// app.get("/reg", (req, res) => {
//   res.send("hii").end();
// });
//app.post("/api/reg", register);
// global.rootDir = __dirname;
const errorHandler=require('./middelware/error');
app.get('/',(req, res) => {
  res.send('API is available');
})
const auth = require('./routes/auth');
app.use('/api/v1/auth',auth);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("server listen on 4000");
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.body, "file", req.file);
  res.send({ ...req.file, ...req.body }).end();
});

app.use("/api", require("./routes/dataRoutes"));

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.R_KEY,
  key_secret: process.env.R_SECRATE,
});

const JOB = require("./models/Job");
const DigitalLearning = require("./models/DigitalLearning.js");
const JobApply = require("./models/JobApply.js");

app.post("/pay", async (req, res) => {
  try {
    // const application = null;
    if (req.body.type == "job") {
      const application = await JobApply.findOne({
        jobApplyId: req.body.id + req.body.email,
      });
      if (!application) {
        return res.status(400).json({ msg: "apply first" });
      }

      if (application.category === "SC" || application.category === "PC") {
        let job = await JOB.findOne({ _id: req.body.id });

        if (!job) return res.status(400).json({ msg: "bad request" });

        payment(job.application_fee_dis, req, res);
      } else {
        let job = await JOB.findOne({ _id: req.body.id });
        console.log("jobid", job, req.body.id);
        if (!job) return res.status(400).json({ msg: "bad request" });
        payment(job.application_fee, req, res);
      }
    } else {
      let job = await DigitalLearning.findOne({ _id: req.body.id });
      console.log("jobid", job, req.body.id);
      if (!job) return res.status(400).json({ msg: "bad request" });
      payment(job.price, req, res);
    }
  } catch (er) {
    console.log(er);
  }
});

const payment = async (amount, req, res) => {
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "hftryukijhgutyujh78iou98766543567",
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
};
app.post('/applyjob',async (req, res)=>{
    try{
        const application= await JobApply.create(req.body);
        res.status(201).json({success:true,application:application})
    } catch (error) {
        res.status(408).json({success:true,message:"You already had applied for this job !"})
    }
})
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
  app.get('/applied',async function(req,res){
      const applications= await JobApply.find();
      res.json({applications});
  })
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

module.exports = app;
