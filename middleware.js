const Listing=require("./module/listing");
const Review=require("./module/review");


module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
      if(req.method === "GET"){
        req.session.redirecturl=req.originalUrl;
      }
    req.flash("error","you are not loggin");
     return  res.redirect("/login");
   }
   next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
  if(req.session.redirecturl){
    res.locals.redirecturl=req.session.redirecturl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let {id} =req.params;
  let listing = await Listing.findById(id);
  
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();

}

module.exports.isReviewAuthor = async (req,res,next)=>{

  console.log(req.user);
    console.log(res.locals.currUser);
  let {reviewId} =req.params;
  let review = await Review.findById(reviewId);
  
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you are not author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();

}