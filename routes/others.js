var express=require("express");
var router=express.Router({mergeParams:true});
var request=require('request');

router.get("/others",function(req,res){
	res.render("others/others")
});
router.get("/search",function(req,res){
	res.render("others/search");
	console.log("server accessed by someone right now!!!");
});


router.get("/results",function(req,res){
	var mname=req.query.msrch;
	var url="http://www.omdbapi.com/?s="+mname+"&apikey=1d8da567";
	request(url,function(error,response,body){
		if(!error && response.statusCode==200){
			var parsedData=JSON.parse(body);
			res.render("others/result", {parsedData: parsedData});
		}
	});
});


module.exports=router;