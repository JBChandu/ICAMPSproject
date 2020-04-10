require('dotenv').config()
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localStategy=require("passport-local");
var methodOverride=require("method-override");
var async=require("async");
var nodemailer=require("nodemailer");
var crypto=require("crypto");
var DB=process.env.DATABASEURL||"mongodb://localhost:27017/Yelp_Camp_5";
mongoose.connect(DB, {useNewUrlParser:true,useUnifiedTopology:true});
var User=require("./models/users");
var Comment=require("./models/comments");
var campGround=require("./models/campgrounds");
var campgroundRoutes=require("./routes/campgrounds");
var commentsRoutes=require("./routes/comments");
var authRoutes=require("./routes/index");
var otherRoutes=require("./routes/others");
var flash=require("connect-flash");
var seedDB=require("./seeding");
app.use(require("express-session")({
	secret:"secret message-shinchan",
	resave:false,
	saveUninitialized:false
}));
app.use(flash());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

console.log(__dirname);
//seedDB();
app.locals.moment=require('moment');

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	res.locals.warning=req.flash("warning");
	next();
});


app.use("/campGrounds",campgroundRoutes);
app.use("/campGrounds/:id/comments",commentsRoutes);
app.use(authRoutes);
app.use(otherRoutes);

// //middleware
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

app.get("*",function(req,res){
	res.render("errpage");
});

app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("YELPcamp server started sucessfully");
});