
const express = require("express");
const playlistRouter = express.Router();

const playlistcontroller = require("../Controllers/playlistcontroller");
const middleware = require("../middleware/middleware");

// Create a playlist
playlistRouter.post(
    "/create",
    middleware,
    playlistcontroller.createPlaylist
);

// Get all playlists belonging to the logged-in user
playlistRouter.get(
    "/userplaylists",
    middleware,
    playlistcontroller.getUserPlaylists
);

// Add a song to a playlist
playlistRouter.post(
    "/:id/addsong",
    middleware,
    playlistcontroller.addSongToPlaylist
);

// Remove a song from a playlist
playlistRouter.delete(
    "/:id/removesong",
    middleware,
    playlistcontroller.removeSongFromPlaylist
);

// Delete a playlist
playlistRouter.delete(
    "/:id/delete",
    middleware,
    playlistcontroller.deleteplaylist
);

// Update playlist details
playlistRouter.put(
    "/:id/update",
    middleware,
    playlistcontroller.updatePlaylist
);

// Get one playlist by ID
playlistRouter.get(
    "/:id",
    middleware,
    playlistcontroller.getPlaylistById
);

module.exports = playlistRouter;
