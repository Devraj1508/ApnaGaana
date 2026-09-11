const listeninghistorymodel = require('../models/listeninghistorymodel');

async function recordsongplay(req,res){
    try{
        const userId=req.user.id;
        const {songId}=req.body;

        if(!songId || songId.trim() === ''){
            return res.status(400).json({message: "Song ID is required"});
        }
        const newReord=await listeninghistorymodel.create({
            user:userId,
            song:songId
        });
        res.status(201).json({message:"Song play recorded successfully",record:newReord});
    } catch(error){
        console.error("Error recording song play:", error);
        res.status(500).json({message: error.message});
    }
}

//get listening history for a user
async function getlisteninghistory(req,res){
    try{
        const userId=req.user.id;

        if(!userId || userId.trim() === ''){
            return res.status(400).json({message: "User ID is required"});
        }
        const history=await listeninghistorymodel.find({user:userId}).populate('song').sort({listenedAt:-1});
        res.status(200).json({message:"Listening history retrieved successfully", history});
    } catch(error){
        console.error("Error retrieving listening history:", error);
        res.status(500).json({message: error.message});
    }
}

module.exports={
    recordsongplay,
    getlisteninghistory
}