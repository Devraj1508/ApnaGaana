const likesmodel = require('../Models/likesmodel');

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

module.exports={
    likeSong,
    getlikes
}