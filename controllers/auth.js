const User = require('../models/User'),
      asyncHandler = require('../middelware/async'),
      sendMail = require('../utils/sendEmail'),
      crypto=require('crypto'),
      ErrorResponse = require('../utils/errorResponse');

// @desc  register user
// route  POST /api/v1/auth/register
// access Public

exports.register=asyncHandler(async (req,res,next)=>{
    const {name,email,password,role="student"} =req.body;
    // creating user
    const user=await User.create({
        name,
        email,
        password,
        role
    })
    //sendTokenResponse(user,200,res);
    res.status(201).json({
        success:true,
        name:user.name,
        email:user.email,
        _id:user._id,
        role:user.role
    });
})

// @desc  login user
// route  POST /api/v1/auth/login
// access Public

exports.login=asyncHandler(async (req,res,next)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return next(new ErrorResponse(`Please provide email and password`,400));
    }
    // check for user
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorResponse(`Invalid credentials`,401));
    }
    // check if password matches
    const isMatch=await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse(`Invalid credentials`,401));
    }
   // sendTokenResponse(user,200,res);
   res.status(200).json({
    success:true,
    name:user.name,
    email:user.email,
    _id:user._id,
    role:user.role
   });
})

// @desc  get current logged in user
// route  GET /api/v1/auth/me
// access Private

exports.getMe=asyncHandler(async (req,res,next)=>{
 const user= await User.findById(req.user._id);
 if(!user){
    return next(new ErrorResponse(`No user found with given id ${req.user._id} `,400));
 }
 res.status(200).json({success:true,user});
});

// @desc  Forgot Password
// route  POST /api/v1/auth/forgotpassword
// access Public

exports.forgotpassword=asyncHandler(async (req,res,next)=>{
    let user= await User.findOne({email:req.body.email});
    if(!user){
        return  next(new ErrorResponse(`There is no such user with given email ${req.body.email}`,404));
    }
     res.status(200).json({
        success:true,
        name:user.name,
        email:user.email,
        _id:user._id,
        role:user.role
       })
});

 // @desc  Update Password
// route  PUT /api/v1/auth/updatepassword
// access Private

exports.updatepassword=asyncHandler(async (req,res,next)=>{
    if(!req.body.email || !req.body.newPassword){
        return  next(new ErrorResponse(`email and new password both required`,404));
    }
    let user= await User.findOne({email:req.body.email});
    if(!user){
        return  next(new ErrorResponse(`There is no such user with given email ${req.body.email}`,404));
    }
    user.password = req.body.newPassword;
     await user.save();
     res.status(200).json({
        success:true,
        name:user.name,
        email:user.email,
        _id:user._id,
        role:user.role
       });
   });  

// @desc  Update User Details
// route  POST /api/v1/auth/updatedetails
// access Private

exports.updatedetails=asyncHandler(async (req,res,next)=>{
    const fieldsToUpdate={
        name:req.body.name,
        email:req.body.email
    }
    const user= await User.findByIdAndUpdate(req.user._id,fieldsToUpdate,{
        new:true,
        runValidators:true
    });
    if(!user){
       return next(new ErrorResponse(`No user found with given id ${req.user._id} `,400));
    }
    res.status(200).json({success:true,data:user});
   });



// @desc  Log user out / clear cookie
// route  GET /api/v1/auth/logout
// access Private

exports.logout=asyncHandler(async (req,res,next)=>{
    res.cookie("token",'',{
        expires:new Date(Date.now() + 10*60*1000),
        httpOnly:true
    })
    res.status(200).json({success:true,date:{}});
   });
   

// Get token from model , create cookie and send response
const sendTokenResponse = (user,statusCode, res) => {
    // create token 
    const token=user.getSignedJwtToken();
    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*60*60*1000*24),
        httpOnly:true
    }
    if(process.env.NODE_ENV==='production'){
        options.secure = true;
    }
    res
       .status(statusCode)
       .cookie('token',token,options)
       .json({
           success:true,
           token
        })
}

module.exports=exports;