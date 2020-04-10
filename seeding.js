var mongoose=require("mongoose");
var Comment=require("./models/comments");
var campGround=require("./models/campgrounds");
var data=[
	{
		name:"nature1",
		image:"https://image.shutterstock.com/image-photo/nature-background-table-wood-product-260nw-285662423.jpg",
		description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		  },
	{
		name:"nature2",
		image:"https://wonderfulengineering.com/wp-content/uploads/2016/01/nature-wallpapers-38.jpg",
		description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		
	},
	{
		name:"nature3",
		image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRPZ4z0B7QKV2BUdmY5aOlfKs7WEzPAPuC8LtaBzoPpGAE6J0lj",
		description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		
	}
];

function seedDB(){
	campGround.remove({},function(err,campgrounds){
		if(err){
			console.log(err);
		}else{
			console.log("camp datas removed right now");
			data.forEach(function(seed){
				campGround.create(seed,function(err,camps){
					if(err){
						console.log(err);
					}else{
						console.log("camps created sucessfully");
						Comment.create({
							text:"what a beautiful heaven",
							author:"ch lan"
						},function(err,comments){
							if(err){
								console.log(err);
							}else{
								camps.comments.push(comments);
								camps.save(function(err){
									if(err){
										console.log(err);
									}else{
										console.log("some one has commented your post");
									}
								});
							}
						});
					}
				});
			});
		}
	});
	
}
module.exports=seedDB;