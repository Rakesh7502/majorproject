module.exports.isLoggedIn = (req,res,next)=>{
    //req.isAuthenticated is used to check whether user is already logged in or not ->it is passport method
  if(!req.isAuthenticated()){
    req.flash("error","you must be logged in to create listing!");
   return res.redirect("/login");
  }
  next();
};