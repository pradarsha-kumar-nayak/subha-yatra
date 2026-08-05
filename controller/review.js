const Listing=require("../module/listing");
const Review=require("../module/review");

//add review

module.exports.addReview=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    // console.log(newreview);
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","review added");
    res.redirect(`/listings/${id}`);
};

//delete review

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
}
