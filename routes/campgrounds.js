var middleware=require("../middleware");
var express=require("express");
var router=express.Router({mergeParams:true});
var campGround=require("../models/campgrounds");


//multer and cloudinary config
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'webdevboot', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});




//campground routes
// INDEX ROUTE
router.get("/",function(req,res){
	console.log(req.user);
	var nomatch=null;
	if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		
		campGround.find({name:regex},function(err,campgrounds){
			if(err){
				console.log(err);
			}else{
				if(campgrounds.length <1){
					nomatch="No match found,Please Try Again";
				}
			res.render("campgrounds/campGrounds",{campGrounds: campgrounds, nomatch: nomatch});	
			}
		});	
		
	   }else{
	   
		campGround.find({},function(err,campgrounds){
			if(err){
				console.log(err);
			}else{
			res.render("campgrounds/campGrounds",{campGrounds: campgrounds, nomatch: nomatch});	
			}
		});	
}
});
// CREATE ROUTE
router.post("/",middleware.isLoggedIn,upload.single('image'),function(req,res){
// 	var name=req.body.name;
// 	var image=req.body.image;
// 	var price=req.body.price;
// 	var desc=req.body.description;
// 	var author={
// 		id:req.user._id,
// 		username:req.user.username
// 	}
// 	var newCampGround={name:name,image:image,price:price,description:desc,author:author};
// 	campGround.create(newCampGround,function(err,campgrounds){
// 	if(err){
// 		req.flash("error","CampGround DB Not Found ");
// 		console.log(err);
// 	}else{
// 		console.log(campgrounds);
// 		req.flash("success","New post added Successfully");
// 		res.redirect("/campGrounds");
// 	}
// });	
// });
	cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.campground.image = result.secure_url;
  // add author to campground
  req.body.campground.author = {
    id: req.user._id,
    username: req.user.username
  }
  campGround.create(req.body.campground, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/campGrounds/' + campground.id);
  });
});
});
	
	
	
	
 

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new.ejs");	
});

// SHOW ROUTE
router.get("/:id",function(req,res){
	campGround.findById(req.params.id).populate("comments likes").exec(function(err,foundCamps){
		if(err){
			req.flash("error","CampGround DB Not Found ");
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCamps});
		}
	});
	
});

//edit route
router.get("/:id/edit",middleware.isAuthorisedUser,function(req,res){
	campGround.findById(req.params.id,function(err,foundcampgrnds){
			res.render("campgrounds/edit", {campgrounds:foundcampgrnds});	
	});
});

//update route
router.put("/:id",middleware.isAuthorisedUser,function(req,res){
	campGround.findByIdAndUpdate(req.params.id,req.body.campground,function(err,camps){
		if(err){
			console.log(err);
			res.redirect("/campGrounds/"+req.params.id);
		}else{
			req.flash("success","Post updated Successfully!");
			res.redirect("/campGrounds/"+req.params.id);
		}
		
	});
});

//destroy route
router.delete("/:id",middleware.isAuthorisedUser,function(req,res){
	campGround.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","You don't have permissions to do that!");
			console.log(err);
		}else{
			req.flash("error","Post DELETED Successfully");
			res.redirect("/campGrounds");
		}
	});
});




// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    campGround.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campGrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});





function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;