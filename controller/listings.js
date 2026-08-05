const Listing =require("../module/listing");

//all listing
module.exports.index=async(req,res)=>{
    const allListing =await Listing.find({});
    res.render("listings/index.ejs",{allListing});

};

//newform
module.exports.rendernewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

//show listing

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
    

};

//new listing post

module.exports.newlistingPost=async(req,res)=>{
   
    const listing=new Listing(req.body.listing);
    listing.owner=req.user._id;
    await listing.save();
    req.flash("success","New Listing Created");

    res.redirect("/listings")
    
}

//liting edit form

module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    // console.log(list);
    res.render("listings/edit.ejs",{list})
}

//edit listing

module.exports.editListing=async (req,res)=>{
    let {id}=req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

//delete listing

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletelist=await Listing.findByIdAndDelete(id);
    // console.log(deletelist);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}

//search

module.exports.search=async(req,res)=>{
    
    let{q}=req.query;

    const listings= await Listing.find({
        $or:[
            {
                title:{
                    $regex:q,
                    $options:"i"
                }
            },
            {
               location:{
                $regex:q,
               
               } 
            }
        ]
    });

     res.render("listings/search.ejs",{listings});

}


