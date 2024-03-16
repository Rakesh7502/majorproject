const Listing = require("../models/listing");



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };


module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path :"reviews",
    populate:{
      path: "author",
    },
  })
    .populate("owner");//populate->for showing full review object
    if(!listing){ //when ever a user trying to access a listing which deleted then this message will be displyed nd redirected to index page
      req.flash("error","Listing you requested does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

module.exports.createListing = async (req, res,next) => {
 
  
    // let {title,description,image,price,county,location}=req.body;
 const newListing = new Listing(req.body.listing); //to create new instance in database of user inputed data
 newListing.owner = req.user._id;
 await newListing.save();
 req.flash("success","New Listing Created!");//alert/flash message is appeared whenever a new listing is created
 res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  };


  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  };

