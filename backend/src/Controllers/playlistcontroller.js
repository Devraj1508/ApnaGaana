const playlistmodel = require('../models/playlistmodels');

async function createPlaylist(req,res){
    try{
        const userId=req.user.id;
        const {name,description,covers}=req.body;
        
        if(!name || name.trim() === ''){
            return res.status(400).json({message: "Playlist name is required"});
        }

        if(!description || description.trim() === ''){
            return res.status(400).json({message: "Playlist description is required"});
        }

        if(!covers || covers.length === 0){
            return res.status(400).json({message: "Playlist covers are required"});
        }

        const newPlaylist = await playlistmodel.create({
            name,
            description,
            user: userId,
            covers,
            songs:[]
        });
        res.status(201).json({message: "Playlist created successfully", playlist: newPlaylist});
    }
    catch(error){
        console.error("Error creating playlist:", error);
        res.status(500).json({message: error.message});
    }
}

//add song to playlist
async function addSongToPlaylist(req,res){
    try{
        const userId=req.user.id;
        const playlistId=req.params.id;
        const {songId}=req.body;

        if(!playlistId || playlistId.trim() === ''){
            return res.status(400).json({message: "Playlist ID is required"});
        }

        if(!songId || songId.trim() === ''){
            return res.status(400).json({message: "Song ID is required"});
        }
        const playlist = await playlistmodel.findById(playlistId);
        if(!playlist){
            return res.status(404).json({message: "Playlist not found"});
        }

        // Check if the user is the owner of the playlist
        if(playlist.user.toString() !== userId){
            return res.status(403).json({message: "You are not the owner of this playlist"});
        }

        //check if the song is already in the playlist
       const songExists = playlist.songs.some(
    id => id.toString() === songId.toString()
);

if(songExists){
    return res.status(400).json({
        message: "Song is already in the playlist"
    });
}
        // Add the song to the playlist
        playlist.songs.push(songId);
        await playlist.save();
        res.status(200).json({message: "Song added to playlist successfully", playlist});
    } catch(error){
        console.error("Error adding song to playlist:", error);
        res.status(500).json({message: error.message});
    }
}

//get all playlists of a user
async function getUserPlaylists(req,res){
    try{
        const userId=req.user.id;
        const playlists =await playlistmodel.find({user:userId}).populate('songs');
        res.status(200).json({message: "User playlists retrieved successfully", playlists});
    } catch(error){
        console.error("Error retrieving user playlists:", error);
        res.status(500).json({message: error.message});
    }
}

//delete a playlist
async function deleteplaylist(req,res){
try{
    const userId=req.user.id;
    const playlistId=req.params.id;

    if(!playlistId || playlistId.trim() === ''){
        return res.status(400).json({message: "Playlist ID is required"});
    }   
    const playlist = await playlistmodel.findById(playlistId);
    if(!playlist){
        return res.status(404).json({message: "Playlist not found"});
    } 
    if(playlist.user.toString() !== userId){
    return res.status(403).json({
        message: "You are not the owner of this playlist"
    });
}
    await playlistmodel.findByIdAndDelete(playlistId);  
    res.status(200).json({message: "Playlist deleted successfully"});
} catch(error){
    console.error("Error deleting playlist:", error);
    res.status(500).json({message: error.message});
}
}

//remove song from playlist
async function removeSongFromPlaylist(req,res){
    try{
        const userId=req.user.id;
        const playlistId=req.params.id;
        const {songId}=req.body;

        if(!playlistId || playlistId.trim() === ''){
            return res.status(400).json({message: "Playlist ID is required"});
        }

        if(!songId || songId.trim() === ''){
            return res.status(400).json({message: "Song ID is required"});
        }

        const playlist = await playlistmodel.findById(playlistId);
        if(!playlist){
            return res.status(404).json({message: "Playlist not found"});
        }

        // Check if the user is the owner of the playlist
        if(playlist.user.toString() !== userId){
            return res.status(403).json({message: "You are not the owner of this playlist"});
        }

        // Check if the song is in the playlist
        const songExists = playlist.songs.some(
            id => id.toString() === songId.toString()
        );
        if(!songExists){
            return res.status(400).json({message: "Song is not in the playlist"});
        }

        // Remove the song from the playlist
        playlist.songs = playlist.songs.filter(id => id.toString() !== songId.toString());
        await playlist.save();
        res.status(200).json({message: "Song removed from playlist successfully", playlist});
    } catch(error){
        console.error("Error removing song from playlist:", error);
        res.status(500).json({message: error.message});
    }
}

//get one playlist by id
async function getPlaylistById(req,res){
    try{
        const userId=req.user.id;
        const playlistId=req.params.id;

        if (!playlistId || playlistId.trim() === "") {
            return res.status(400).json({
                message: "Playlist ID is required"
            });
        }
        const playlist = await playlistmodel.findById(playlistId).populate('songs');
        if(!playlist){
            return res.status(404).json({message: "Playlist not found"});
        }
        if(playlist.user.toString() !== userId){
            return res.status(403).json({message: "You are not the owner of this playlist"});
        }
        res.status(200).json({message: "Playlist retrieved successfully", playlist});
    } catch(error){
        console.error("Error retrieving playlist by ID:", error);
        res.status(500).json({message: error.message});
    }
}

//update playlist details
async function updatePlaylist(req,res){
    try{
        const userId=req.user.id;
        const playlistId=req.params.id;
        const {name,description,covers}=req.body;

        if(!playlistId || playlistId.trim() === ''){
            return res.status(400).json({message: "Playlist ID is required"});
        }

        const playlist = await playlistmodel.findById(playlistId);
        if(!playlist){
            return res.status(404).json({message: "Playlist not found"});
        }

        if(playlist.user.toString() !== userId){
            return res.status(403).json({message: "You are not the owner of this playlist"});
        }

        if(name !== undefined){
    if(name.trim() === ""){
        return res.status(400).json({
            message: "Playlist name cannot be empty"
        });
    }

    playlist.name = name.trim();
}
        if(description !== undefined){
            playlist.description = description;
        }
      if(covers!== undefined){ 
    playlist.covers = covers;
}

        await playlist.save();
        res.status(200).json({message: "Playlist updated successfully", playlist});
    } catch(error){
        console.error("Error updating playlist:", error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createPlaylist,
    addSongToPlaylist,
    getUserPlaylists,
    deleteplaylist,
    removeSongFromPlaylist,
    getPlaylistById,
    updatePlaylist
};