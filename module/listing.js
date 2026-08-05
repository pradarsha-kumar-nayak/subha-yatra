const mongoose=require("mongoose");
const Review=require("./review");
let Schema=mongoose.Schema;

const listingschema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        set:(v)=> v === ""?"https://images.unsplash.com/photo-1655352710727-6c89536454b3?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    },
    price:Number,
    location:String,
    country:String,

    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
        }
     ],

     owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
     }
});

listingschema.post("findOneAndDelete",async(listing)=>{
     await Review.deleteMany({_id:{$in:listing.reviews}});
})

const Listing =mongoose.model("Listing",listingschema);
module.exports = Listing;