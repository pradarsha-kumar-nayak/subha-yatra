require("dotenv").config();
const express = require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./module/listing");
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
// const wrapAsync=require("./util/wrapAsync");
const expressError=require("./util/expressError");
// const {listingschema,reviewschema}=require("./schema.js");
// const Review =require("./module/review.js");
const flash=require("connect-flash");
const session=require("express-session");
const {MongoStore}=require("connect-mongo");

const passport=require("passport");
const localstrategy =require("passport-local");
const user =require("./module/user.js");




//roter
const listings =require("./routes/listing.js"); 
const reviews =require("./routes/review.js");
const userRouter =require("./routes/user.js");



// const mongourl="mongodb://127.0.0.1:27017/subha-yatra";

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log(" mongo db connected");
}).catch((e)=>{
    console.log(e);
})

async function main() {
  await mongoose.connect(dbUrl);    
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

//session

//mongo session

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
})

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
});

const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7*24*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};



app.get("/",(req,res)=>{
    res.send("hii i am root");
})

app.use(session(sessionoption));
app.use(flash());

//authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/home",async(req,res)=>{
    const homlist=await Listing.find({
        title:{
            $in:["puri beach","bhitarkanika","konark","kedarnath"]
        }
    });
    res.render("listings/home.ejs",{homlist});
})

app.get("/demouser",async(req,res)=>{
    let fakeuser=new user({
        email:"lilu@12",
        username:"pradarsha",
    })

    let registeruser=await user.register(fakeuser,"12345");
    res.send(registeruser);
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);


app.use((req,res,next)=>{
    next(new expressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statuscode=500,message}=err;
    res.status(statuscode).render("error.ejs",{message});
    // res.status(statuscode).send(message);
})


app.listen("8080",()=>{
    console.log("app is listen");
})
