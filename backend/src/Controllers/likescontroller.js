const likesmodel = require('../models/likemodel');

//like a song
async function likeSong(req, res) {
    try{
        const userId = req.user.id;
        const songId = req.params.id;
        if(!songId){
            return res.status(400).json({
                message: "Song ID is required"
            })
        }
        const existingLike = await likesmodel.findOne({ user: userId, song: songId });
        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this song" });
        }

        const like = await likesmodel.create({
            user: userId,
            song: songId
        });
        res.status(201).json({"message": "Song liked successfully", "like": like});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get all likes of a song
async function getlikes(req,res){
    try{
        const songId=req.params.id;
        if(!songId){
            return res.status(400).json({
                message: "Song ID is required"
            })
        }
        const likes = await likesmodel.find({ song: songId }).populate('user', 'name email');
        res.status(200).json({"message": "Likes retrieved successfully", "likes": likes});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//get likestatus 
async function getLikeStatus(req, res) {
    try {
        const songId = req.params.id;
        const userId = req.user.id;
        if (!songId) {
            return res.status(400).json({
                message: "Song ID is required"
            })
        }
        const like = await likesmodel.findOne({ user: userId, song: songId });
        return res.status(200).json({liked: !!like});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//delete a like or unlike a song
async function unlikeSong(req,res){
    try{
        const songId=req.params.id;
        const userId=req.user.id;
        if(!songId){
            return res.status(400).json({
                message: "Song ID is required"
            })
        }
        const like = await likesmodel.findOneAndDelete({ user: userId, song: songId });
        if(!like){
            return res.status(404).json({
                message: "Like not found"
            })
        }
        res.status(200).json({"message": "Song unliked successfully", "like": like});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports={
    likeSong,
    getlikes,
    unlikeSong,
    getLikeStatus
}