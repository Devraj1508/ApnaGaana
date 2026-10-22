const songmodel = require("../models/songsmodel");
const ImageKit=require("@imagekit/nodejs")
const {toFile}=require("@imagekit/nodejs")

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

async function uploadSong(req,res) {
    try {
        const UserId = req.user.id;

          if(!req.files?.file?.[0]){
            return res.status(400).json({ error: "No file uploaded" });
          }

           if(!req.files?.cover?.[0]){
            return res.status(400).json({
                error: "No cover image uploaded"
            });
        }

         const audioFile = req.files.file[0];
         const coverFile = req.files.cover[0];


        const issongalreadyexists = await songmodel.findOne({ title: req.body.title, uploadedBy: UserId });
        if (issongalreadyexists) {
            return res.status(400).json({ error: "Song with this title already exists" });
        }

        // Upload audio file to ImageKit
        const file = await client.files.upload({
        file: await toFile(Buffer.from(audioFile.buffer), 'file'),
        fileName: audioFile.originalname,
        folder:'dev-apna-gaana'
});

  // Upload cover to ImageKit
        const coverUpload = await client.files.upload({
            file: await toFile(
                Buffer.from(coverFile.buffer),
                'cover'
            ),
            fileName: coverFile.originalname,
            folder:'dev-apna-gaana/covers'
        });      

const song=await songmodel.create({
             uploadedBy: UserId,
            title: req.body.title,
            artist: req.body.artist,
            audio: file.url,
            cover: coverUpload.url,
            duration: Number(req.body.duration)
})
res.status(200).json({ message: "Song uploaded successfully", song });
    } catch (error) {
        console.error("Error uploading song:", error);
        res.status(500).json({ error: "Error uploading song" });
    }
}

// get all songs
async function getAllSongs(req, res) {
    try {
        const songs = await songmodel
            .find()
            .populate("uploadedBy", "username");

        return res.status(200).json({
            message: "Songs fetched successfully",
            songs
        });
    } catch (error) {
        console.error("Error fetching songs:", error);

        return res.status(500).json({
            message: "Failed to fetch songs"
        });
    }
}

//get all songs uploaded by a specific user
async function getSongsByUser(req,res){
    try{
        const userId=req.params.id;

        if(!userId){
            return res.status(400).json({ error: "User ID is required" });
        }
        const songs=await songmodel.find({uploadedBy:userId}).populate('uploadedBy','username profilePicture');
        res.status(200).json({songs});
    }catch(error){
        console.error("Error fetching songs by user:", error);
        res.status(500).json({ error: "Error fetching songs by user" });
    }
}

//get any song by its id
async function getSongById(req,res){
    try{
        const songId=req.params.id;
        if(!songId){
            return res.status(400).json({error:"Song ID is required"});
        }
        const song=await songmodel.findById(songId).populate('uploadedBy','username profilePicture');
        if(!song){
            return res.status(404).json({error:"Song not found"});
        }
        res.status(200).json({song});
    }catch(error){
        console.error("Error fetching song by ID:", error);
        res.status(500).json({ error: "Error fetching song by ID" });
    }
}

//update song

async function updateSong(req,res){
    try{
        const songId=req.params.id;
        const {title,artist,duration}=req.body;

        const song=await songmodel.findById(songId)
        if(!song){
            return res.status(404).json({error:"Song not found"});
        }
        const isOwner = req.user.id.toString() === song.uploadedBy.toString();

        if(!isOwner){
            return res.status(403).json({error:"You are not authorized to update this song"});
        }
        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({ error: "Song title is required" });
            }
            song.title = title.trim();
        }
        if (artist !== undefined) {
            if (typeof artist !== "string" || !artist.trim()) {
                return res.status(400).json({ error: "Singer name is required" });
            }
            song.artist = artist.trim();
        }
        if (req.file) {
            const coverUpload = await client.files.upload({
                file: await toFile(Buffer.from(req.file.buffer), 'cover'),
                fileName: req.file.originalname,
                folder: 'dev-apna-gaana/covers'
            });
            song.cover = coverUpload.url;
        }
        if(duration!==undefined){
            song.duration=duration;
        }
        await song.save();
        await song.populate("uploadedBy", "username profilePicture");
        res.status(200).json({song});
    }catch(error){
        console.error("Error updating song:", error);
        res.status(500).json({ error: "Error updating song" });
    }
}

//Delete song
async function deleteSong(req,res){
    try{
        const songId=req.params.id;
        const song=await songmodel.findById(songId);
        if(!songId){
            return res.status(400).json({error:"song ID is required"});
        }
        if(!song){
            return res.status(404).json({error:"Song not found"});
        }
        if(req.user.id.toString()!==song.uploadedBy.toString()){
            return res.status(403).json({error:"You are not authorized to delete this song"});
        }
        const deletedSong=await songmodel.findByIdAndDelete(songId);
        res.status(200).json({message:"Song deleted successfully",deletedSong});
    }catch(error){
        console.error("Error deleting song:", error);
        res.status(500).json({ error: "Error deleting song" });
    }
}

//get mysongs
async function getMySongs(req,res){
    try{
        const userId=req.user.id;
        const songs=await songmodel.find({uploadedBy:userId}).populate('uploadedBy','username profilePicture');
        res.status(200).json({songs});
    }catch(error){
        console.error("Error fetching my songs:", error);
        res.status(500).json({ error: "Error fetching my songs" });
    }
}

//search songs by title or artist
async function searchSongs(req,res){
    try{
        const {query}=req.query;
        if(!query || query.trim()=== ''){
            return res.status(400).json({error:"Search query is required"});
        }
        const songs=await songmodel.find({
            $or:[
                {title:{$regex:query,$options:'i'}},
                {artist:{$regex:query,$options:'i'}}
            ]
        }).populate('uploadedBy','username profilePicture');
        res.status(200).json({
            message:"song found successfully",
            songs});
    }catch(error){
        console.error("Error searching songs:", error);
        res.status(500).json({ error: "Error searching songs" });
    }
}


module.exports = {
    uploadSong,getAllSongs,getSongsByUser,getSongById,updateSong,deleteSong,getMySongs,searchSongs
};
