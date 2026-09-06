const mongoose = require('mongoose');

const songSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    audio:{
        type:String,
        required:true
    },
    cover:{
        type:String,
        required:false
    },
    duration:{
        type:Number,
        required:true
    },
        uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});
const songModel=mongoose.model("Song",songSchema);

module.exports=songModel;
