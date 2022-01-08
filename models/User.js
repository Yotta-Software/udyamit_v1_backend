const mongoose=require('mongoose'),
      bcrypt=require('bcryptjs'),
      crypto=require('crypto'),
      jwt=require('jsonwebtoken'),
      UserSchema= new mongoose.Schema({
           name:{
               type:String,
               required:[true,'user name is required']
           },
           email:{
            type: String,
            match: [
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              'Please provide a valid email'
            ],
            required:[true ,'Email is required'],
            unique:true,
          },
          role:{
              type:String,
              enum:['student'],
              default:'student'
          },
          password:{
              type:String,
              required:[true ,'Password is required'],
              minlength:[6,' password must  contain atleast 6 characters '],
              select:false,
          },
          resetPasswordToken:String,
          resetPasswordExpire:Date,
          createdAt:{
              type:Date,
              default:Date.now
          }
      });
// Encrypt password by using bcryptjs
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next(); 
})
// Sign JWT and return 
UserSchema.method('getSignedJwtToken',function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
})
// Match user entered password with hashed password in database
UserSchema.method('matchPassword', async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
})
// Generate and hash resetPassword token
UserSchema.method('getResetPasswordToken',function(){
    // Generate resetToken 
    const resetToken=crypto.randomBytes(20).toString('hex');
    // Hash resetToken and set it to resetPasswordToken field.
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    // set expire
    this.resetPasswordExpire = Date.now() + 10 *60 * 1000; // reset token is alive for 10 minutes
    return resetToken;
})
module.exports=mongoose.model("User",UserSchema);