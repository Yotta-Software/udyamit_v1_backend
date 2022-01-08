const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err,req,res,next)=>{
    let error={...err};
    error.message=err.message;
    // Mongoose Bad ObjectId
    if(err.name === 'CastError'){
      const message = `Resource does not found for given id ${err.value}`;
      error=new ErrorResponse(message ,404)
    }
    // Mongoose Duplicate field value
    if(err.code === 11000){
        const message = `Duplicate field value entered for key ${Object.keys(err.keyValue).map(val => val)}`;
        error=new ErrorResponse(message ,400)
    }
    // Mongoose validation Error
    if(err.name === 'ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message);
        error=new ErrorResponse(message ,400)
    }
    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message
    })
}
module.exports=errorHandler;