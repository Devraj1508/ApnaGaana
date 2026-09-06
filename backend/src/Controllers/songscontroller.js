const songmodel = require("../Models/songsmodel");
const ImageKit=require("@imagekit/nodejs")
const {toFile}=require("@imagekit/nodejs")

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

async function uploadSong(req, res) {
    try {
        const UserId = req.user.id;

          if(!req.file){
            return res.status(400).json({ error: "No file uploaded" });
          }

        const issongalreadyexists = await songmodel.findOne({ title: req.body.title, uploadedBy: UserId });
        if (issongalreadyexists) {
            return res.status(400).json({ error: "Song with this title already exists" });
        }

        const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: req.file.originalname,
        folder:'dev-apna-gaana'
});
const song=await songmodel.create({
             uploadedBy: UserId,
            title: req.body.title,
            artist: req.body.artist,
            audio: file.url,
            cover: req.body.cover,
            duration: Number(req.body.duration)
})
res.status(200).json({ message: "Song uploaded successfully", song });
    } catch (error) {
        console.error("Error uploading song:", error);
        res.status(500).json({ error: "Error uploading song" });
    }
}

// get all songs
async function getAllSongs(req,res){
    try{
        const songs=await songmodel.find().populate('uploadedBy','username profilePicture');
        res.status(200).json({songs});
    }catch(error){
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: "Error fetching songs" });
    }
}

//get all songs uploaded by a specific user
async function getSongsByUser(req,res){
    try{
        const userId=req.params.id;

        if(!userId){
            return res.status(400).json({ error: "User ID is required" });
        }
        const songs=await songmodel.findById(userId).populate('uploadedBy','username profilePicture');
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
        const {title,artist,cover,duration}=req.body;
        const song=await songmodel.findByIdAndUpdate(songId,{title,artist,cover,duration},{new:true}).populate('uploadedBy','username profilePicture');
        if(!song){
            return res.status(404).json({error:"Song not found"});
        }
        if(title!==undefined){
            song.title=title;
        }
        if(artist!==undefined){
            song.artist=artist;
        }
        if(cover!==undefined){
            song.cover=cover;
        }
        if(duration!==undefined){
            song.duration=duration;
        }
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
        if(!songId){
            return res.status(400).json({error:"song ID is required"});
        }
        const song=await songmodel.findByIdAndDelete(songId);
        if(!song){
            return res.status(404).json({error:"Song not found"});
        }
        res.status(200).json({message:"Song deleted successfully"});
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


module.exports = {
    uploadSong,getAllSongs,getSongsByUser,getSongById,updateSong,deleteSong,getMySongs
};

