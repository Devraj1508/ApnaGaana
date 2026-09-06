const mongoose=require("mongoose");

const followuserSchema=new mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }, 
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true});
followuserSchema.index({follower:1,following:1},{unique:true});
const FollowUser=mongoose.model("FollowUser", followuserSchema);


module.exports=FollowUser;