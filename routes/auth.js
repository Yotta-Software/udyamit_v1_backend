const express=require('express'),
      {
            register,
            login,
            getMe,
            forgotpassword,
            resetPassword,
            updatedetails,
            updatepassword,
            logout
      }=require('../controllers/auth'),
      {protect}=require('../middelware/auth'),
      router=express.Router();
      
      router.route('/register')
            .post(register);
      router.route('/login')
            .post(login);
      router.route('/logout')
            .get(logout);
      router.route('/me')
            .get(protect,getMe);
      router.route('/forgotpassword')
            .post(forgotpassword);
      router.route('/updatedetails')
            .put(protect,updatedetails);
      router.route('/updatepassword')
            .put(updatepassword);

      module.exports=router;