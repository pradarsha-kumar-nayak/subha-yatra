const express=require("express");
const router=express.Router();
const User=require("../module/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const passport =require("passport");
const {saveRedirectUrl}=require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res,next)=>{
 try{
    let {username,email,password}=req.body;
    const newuser=new User({email,username});
    const registeruser=await User.register(newuser,password);
    req.login(registeruser,(err)=>{
      if(err){
         return next(err);
      }

       req.flash("success","welcom subhyatra");
       res.redirect("/listings");
    })
   
 }catch(e){
    req.flash("error","username already existed try another");
    res.redirect("/signup");
 }
    
}))

router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
   req.flash("success","welcome subhayatra");
   const redirectUrl=res.locals.redirecturl || "/listings";
   res.redirect(redirectUrl);
})

router.get("/logout",(req,res,next)=>{
   req.logOut((err)=>{
      if(err){
        return next(err);
      }

      req.flash("success","you are logged out");
      res.redirect("/listings");
   })
})

router.get("/profile",(req,res)=>{
   res.render("listings/profile.ejs");
})

module.exports = router;