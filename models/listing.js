const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review =require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://www.bing.com/ck/a?!&&p=ac886141107c4406JmltdHM9MTcwNzI2NDAwMCZpZ3VpZD0yZGRlOWY3MC03MWE1LTZlMzAtMmZjZS04ZDkyNzA3MDZmOWImaW5zaWQ9NTYyMQ&ptn=3&ver=2&hsh=3&fclid=2dde9f70-71a5-6e30-2fce-8d9270706f9b&u=a1L2ltYWdlcy9zZWFyY2g_cT1iZWFjaCBpbWFnZSZGT1JNPUlRRlJCQSZpZD05NEIyQzc4QkQyNjAzOUVFQ0ZCRDY4NzUyODA2QTVBMkREOEYyOTNF&ntb=1",
        set:(v)=>
        v===""?"https://www.bing.com/ck/a?!&&p=ac886141107c4406JmltdHM9MTcwNzI2NDAwMCZpZ3VpZD0yZGRlOWY3MC03MWE1LTZlMzAtMmZjZS04ZDkyNzA3MDZmOWImaW5zaWQ9NTYyMQ&ptn=3&ver=2&hsh=3&fclid=2dde9f70-71a5-6e30-2fce-8d9270706f9b&u=a1L2ltYWdlcy9zZWFyY2g_cT1iZWFjaCBpbWFnZSZGT1JNPUlRRlJCQSZpZD05NEIyQzc4QkQyNjAzOUVFQ0ZCRDY4NzUyODA2QTVBMkREOEYyOTNF&ntb=1":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
        type:Schema.Types.ObjectId,//inserting reviews for every post
        ref: "Review",
   
    }, 
    ],
});

//mongoose middleware to delete reviews from database
listingSchema.post("findOneAndDelete", async (listing)=>{
    //AFTER DELETEING ANY LISTING THE REVIEWS ALSO MUST BE DELETED FROM DB SO,WE ARE DELETING IT BY TRAVERSING IN REVIEWS ARRAY AND DELETTING EACH REVIEW
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;