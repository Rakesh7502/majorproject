const express= require("express");
const router = express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
//for server side validation for forms
const {listingschema}=require("../schema.js");
//const {reviewSchema}=require("../schema.js");

//middleware to check whether user is loggedin or not
const {isLoggedIn} = require("../middleware.js");


//SCHEMA VALIDATION FUNCTION
const validateListing = (req,res,next)=>{
    let {error} = listingschema.validate(req.body);
  
    if(error){
      let errorMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errorMsg);
    }else{
      next();
    }
  };

//INDEX route->shows all the listings
router.get("/",
wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//NEW route->to create new listing
router.get("/new", isLoggedIn, 
wrapAsync(async (req, res) => {
  res.render("listings/new.ejs");
}));

//SHOW route->details information of a particular listing
router.get("/:id",
wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");//populate->for showing full review object
  if(!listing){ //when ever a user trying to access a listing which deleted then this message will be displyed nd redirected to index page
    req.flash("error","Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

//CREATE route
//to input a new listing and save it to DB and redirect to listing page
router.post("/", 
validateListing, //->IT IS MIDDLEWARE ONCE USER SEND A REQ THEN IT CHECK FOR SCHEMA VALIDAION once schema is validated then only it proceed
wrapAsync(async (req, res,next) => {
 
  
     // let {title,description,image,price,county,location}=req.body;
  const newListing = new Listing(req.body.listing); //to create new instance in database of user inputed data
  await newListing.save();
  req.flash("success","New Listing Created!");//alert/flash message is appeared whenever a new listing is created
  res.redirect("/listings");
}));

//EDIT route
router.get("/:id/edit", isLoggedIn,
 wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

//UPDATE route
router.put("/:id", isLoggedIn, validateListing,
wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//DELETE route
router.delete("/:id", isLoggedIn ,wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;
