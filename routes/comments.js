var middleware=require("../middleware");
var express=require("express");
var router=express.Router({mergeParams:true});
var campGround=require("../models/campgrounds");
var Comment=require("../models/comments");
//=================
//comments routes//
//=================
//   /campGrounds/:id/comments/new
//   /campGrounds/:id/comments       create route-POST
//comment route:new
router.get("/new",middleware.isLoggedIn,function(req,res){
	campGround.findById(req.params.id,function(err,campgrounds){
		if(err){
			console.log(err);
			res.redirect("/campGrounds");
		}else{
			res.render("comments/new" ,{campground:campgrounds});
		}
	});
});
//comment route:create
router.post("/",middleware.isLoggedIn,function(req,res){
	campGround.findById(req.params.id,function(err,campgrounds){
		if(err){
			console.log(err);
			res.redirect("/campGrounds");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campgrounds.comments.push(comment);
					campgrounds.save(function(err,campgrounds){
						if(err){
							console.log(err);
						}else{
							req.flash("success","Comment created successfully!");
							res.redirect("/campGrounds/"+campgrounds._id);
						}
					});
				}
			});
		}
	});
});


//comment route:edit

router.get("/:comment_id/edit",middleware.isAuthorisedUserToComment,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			req.flash("error","Something went wrong.... ");
			console.log(err);
		}else{
			res.render("comments/edit",{camp_id:req.params.id,comment:foundComment});		
		}
	});
	
});


//comment route:update

router.put("/:comment_id",middleware.isAuthorisedUserToComment,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","comment updated successfully!");
			res.redirect("/campGrounds/"+req.params.id);		
		}
	});
	
});

//comment route:destroy

router.delete("/:comment_id",middleware.isAuthorisedUserToComment,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("error","Comment DELETED Successfully!");
			res.redirect("/campGrounds/"+req.params.id);
		}
	});
});



module.exports=router;