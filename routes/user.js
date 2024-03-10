const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");

//SIGNUP
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    //whenever a user registering is already exist then wrapasync will  handle that error 
    //but it will go to lost/random page so to overcome this we use try catch block
    try{
        let {username,email , password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));


//LOGIN
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

//passport.authenticate is used as a route middleware to authenticate users/requests
router.post(
    "/login" , 
passport.authenticate("local",
 { failureRedirect : '/login' ,
 failureFlash : true
}) ,
async(req,res)=>{
    req.flash("success","welcome back to Wanderlust!");
    res.redirect("/listings");

});

module.exports = router;