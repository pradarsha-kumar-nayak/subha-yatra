const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new schema({
    email:{
        type:String,
        required:true
    },

    wishlist:[
        {
        type:schema.Types.ObjectId,
        ref:"Listing"
        }
     ],
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('user',userSchema);