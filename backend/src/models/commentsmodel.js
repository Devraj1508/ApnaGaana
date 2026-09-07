// comment model
const mongoose = require('mongoose');

const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    song:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Song',
        required:true
    },
    comment:{
        type:String,
        required:true
    }
})

const commentmodel=mongoose.model('Comment',commentSchema);

module.exports=commentmodel;