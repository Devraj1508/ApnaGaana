const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    song:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song",
        required:true
    }
    

},{timestamps:true})
likeSchema.index({user:1,song:1},{unique:true});

const likemodel=mongoose.model("Like",likeSchema);

module.exports=likemodel;