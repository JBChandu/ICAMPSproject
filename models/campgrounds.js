var mongoose=require("mongoose");
var User=require("./users");
var Comment=require("./comments");
var campgroundschema=new mongoose.Schema({
	name:String,
	image:String,
	price:String,
	createdAt:{type:Date, default:Date.now },
	description:String, 
	author:{
		id:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	username:String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	],	 
	likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports=mongoose.model("campGround",campgroundschema);