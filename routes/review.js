const express= require("express");
const router = express.Router({mergeParams:true})  ;

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");

//for server side validation for forms
//const {listingschema}=require("../schema.js");
const {reviewSchema}=require("../schema.js");

const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");



//SCHEMA VALIDATION FOR REVIEWS
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
  
    if(error){
      let errorMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errorMsg);
    }else{
      next();
    }
  };

 //REVIEWS
// POST REVIEW ROUTE->to create a review
//using validateReview function as a middleware
//wrapAsync for error handling
router.post("/", validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!");
    // console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  //DELETE REVIEW ROUTE
  router.delete("/:reviewId" ,
  wrapAsync(async (req,res)=>{
    let {id , reviewId} = req.params;
    //$pull is used to delete/remove a info object in database based on given condition
    await Listing.findByIdAndUpdate(id, {$pull :{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  
  }));

  module.exports= router;
  
  