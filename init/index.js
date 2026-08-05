const mongoose=require("mongoose");
const initdata =require("./data.js");
const Listing=require("../module/listing.js");

const mongo_url="mongodb://127.0.0.1:27017/subha-yatra";

main()
.then(()=>{
    console.log("connected db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}

const initDB =async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=> ({...obj,owner:"6a60bfb98df112f74d866121"}))
    await Listing.insertMany(initdata.data);

}

initDB();