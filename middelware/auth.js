const jwt=require('jsonwebtoken'),
      asyncHandler =require('./async'),
      ErrorResponse =require('../utils/errorResponse'),
      User=require('../models/User');

// Protect routes
exports.protect=asyncHandler(async(req,res,next)=>{
   let token;
   // check if token && starts with Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }else{
        return next(new ErrorResponse(`Not Authorize to access this route `,401));
    }
    // if(req.cookie?.token){
    //     token=req.cookie.token;
    // }

    // Make sure token exsist 
    if(!token){
        return next(new ErrorResponse(`Not Authorize to access this route `,401));
    }
    try {
        //  verify  token
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponse(`Not Authorize to access this route `,401));
    }
});

// grant access to spcific roles
exports.authrize=(...roles)=>(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(`User role ${req.user.role} is not Authorize to access this route .`,403));
    }
    next();
}
module.exports=exports;