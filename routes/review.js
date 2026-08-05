const express =require("express");
const router =express.Router({mergeParams:true});
const Listing=require("../module/listing");
const Review =require("../module/review.js");
const expressError=require("../util/expressError");
const {listingschema,reviewschema}=require("../schema.js");
const wrapAsync=require("../util/wrapAsync");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");

//mvc
const reviewcontroller=require("../controller/review.js");


//review validate

const validateReview=(req,res,next)=>{
    let {error} =reviewschema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }else{
        next();
    }
}

//review

router.post("/", validateReview,isLoggedIn,wrapAsync(reviewcontroller.addReview));

//delete review

router.delete("/:reviewId",isReviewAuthor,reviewcontroller.deleteReview);
module.exports=router;
