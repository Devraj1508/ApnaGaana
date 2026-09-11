const songsmodel = require("../models/songsmodel");
const listeninghistorymodel = require("../models/listeninghistorymodel");
const likesmodel = require("../models/likemodel");


async function getDiscoveryData(req,res){
    try{
        const userId=req.user.id;
        if(!userId || userId.trim() === ''){
            return res.status(400).json({message: "User ID is required"});
        }
        //latest songs
        const latestSongs=await songsmodel
        .find()
        .sort({createdAt:-1})
        .limit(10)
        .populate('uploadedBy','username profilePicture');

        //popular songs based on likes
        const popularSongs=await likesmodel.aggregate([{
            $group:{
                _id:"$song",
                likeCount:{$sum:1}
            }
        }, {
            $sort:{likeCount:-1}
        },{
            $limit:10
        }]);
        const popularSongIds=popularSongs.map(song=>song._id);
        const popularSongsData=await songsmodel.find({_id:{$in:popularSongIds}})
        .populate('uploadedBy','username profilePicture');

        //recently played songs by the user
        const recentlyplayed=await listeninghistorymodel.find({user:userId})
        .sort({listenedAt:-1})
        .limit(10)
        .populate('song')
        .populate('song.uploadedBy','username profilePicture');

        res.status(200).json({
            message:"Discovery data retrieved successfully",
            latestSongs,
            popularSongs:popularSongsData,
            recentlyPlayed:recentlyplayed.map(record=>record.song)
        });
    }catch(error){
        console.error("Error retrieving discovery data:", error);
        res.status(500).json({message: error.message});
    }
}
module.exports={
    getDiscoveryData
}