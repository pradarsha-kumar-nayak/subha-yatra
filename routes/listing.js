const express =require("express");
const router =express.Router();

const wrapAsync=require("../util/wrapAsync");
const expressError=require("../util/expressError");
const {listingschema,reviewschema}=require("../schema.js");
const Listing=require("../module/listing");
const User=require("../module/user.js");

const {isLoggedIn,isOwner}=require("../middleware.js");
//mvc
const listingcontroler=require("../controller/listings.js");


//listing validate
const validateListing=(req,res,next)=>{
    let {error} =listingschema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }else{
        next();
    }
}


router.get("/",wrapAsync(listingcontroler.index));

//wishlist

router.post("/:id/wishlist",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    let usr=await User.findById(req.user._id);
    if(!usr.wishlist.includes(id)){
         usr.wishlist.push(list);

          await usr.save();

    }else{
        req.flash("error","listing already existed");
    }
   
    res.json({
        success: true,
        message: "Added to wishlist"
    });

}))

router.get("/wishlist",isLoggedIn,wrapAsync(async(req,res)=>{
    let usr=await User.findById(req.user._id).populate("wishlist");
    res.render("listings/wishlist.ejs",{wishlist:usr.wishlist});
}))

router.delete("/:id/wishlist",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await User.findByIdAndUpdate(req.user._id,{$pull:{wishlist:id}});
    res.redirect("/listings/wishlist");
}))

router.get("/new",isLoggedIn,listingcontroler.rendernewForm);

//search listings

router.get("/search",wrapAsync(listingcontroler.search));

//show route
router.get("/:id",wrapAsync(listingcontroler.showListing));


// new listing post
router.post("/",validateListing,isLoggedIn,wrapAsync(listingcontroler.newlistingPost));


//edit

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroler.editForm));

//edit put
router.put("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroler.editListing));
//delete

router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingcontroler.deleteListing));



module.exports=router;
