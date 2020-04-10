var campGround=require("../models/campgrounds");
var Comment=require("../models/comments");

var middlewareObj={};

middlewareObj.isAuthorisedUser=	function (req,res,next){
	if(req.isAuthenticated()){
		campGround.findById(req.params.id,function(err,foundcampgrnds){
			if(err){
				req.flash("error","post not found in dB");
				res.redirect("back");
			}else{
				if(foundcampgrnds.author.id.equals(req.user.id)||req.user.isAdmin){
					req.flash("success","verified USER!//:");
					return next();
				}else{
					req.flash("warning","You don't have permissions to do that!");
					res.redirect("back");
				}	
			}
		});
	}else{
		req.flash("error","Please Log-In and Try Again!");
		res.redirect("back");
	}
	
}


middlewareObj.isAuthorisedUserToComment=function (req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundcomments){
			if(err){
				res.flash("error","Comment not found in dB");
				res.redirect("back");
			}else{
				if(foundcomments.author.id.equals(req.user.id)||req.user.isAdmin){
					req.flash("success","verified USER!");
					return next();
				}else{
					req.flash("warning","You don't have permissions to do that");
					res.redirect("back");
				}	
			}
		});
	}else{
		req.flash("error","You are not Logged_In,Please Log-In!");
		res.redirect("back");
	}
	
}


middlewareObj.isLoggedIn=function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error',"You are not logged-in,Please log-in");
	res.redirect("/login");
}



module.exports=middlewareObj;