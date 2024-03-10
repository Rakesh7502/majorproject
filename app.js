const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
//AUTHENTICATION
const passport = require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");

//requiring routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_url);
}

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); //including public folder

//EXPRESS SESSION*******
const sessiomOptions = {
  secret : "mysupersecretcode",
  resave: false,
  saveUninitialized :true,
  cookie:{
    expires :Date.now()+7 * 24 * 60 * 60 * 1000,//this cookie will be deleted after given time period
    maxAge : 7 * 24 * 60 * 60 * 1000,
    hhtpOnly : true,
  },
};

app.get("/", (req, res) => {
  res.send("working");
});

//SESSIONS AND FLASH
app.use(session(sessiomOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash middleware
app.use((req,res,next)=>{
  res.locals.success =req.flash("success");
  res.locals.error=req.flash("error");
  next();
});

//demo user for AUTHENTICATION
// app.get("/demouser",async (req,res)=>{
//   let fakeUser = new User({
//     email :"student@gmail.com",
//     username : "rgukt-student"
//   });
//    let registeredUser=  await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// })


//ALL LISTINGS ROUTES
//all routes are in routes folder and we are using those routes here 
app.use("/listings",listingsRouter);

//ALL REVIEWS ROUTES
app.use("/listings/:id/reviews",reviewsRouter);

//USER SIGNUP ROUTES
app.use("/",userRouter);

//error handling MIDDLEWARE
// app.use((err,req,res,next)=>{
//   res.send("something went wrong!");
// });

//to handle error if any client trying to access undefined routes
app.all("*",(req,res,next)=>{
  next(new ExpressError(404," Page Not Found!"));
});

//EXPRESSERRORS
app.use((err,req,res,next)=>{
  let {status=500 , message="Something went wrong!"}= err;
  console.log(err);
  res.status(status).render("error.ejs",{message});
 // res.status(status).send(message);
});
