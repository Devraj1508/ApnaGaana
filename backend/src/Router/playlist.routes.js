const express = require('express');
const playlistRouter = express.Router();
const playlistcontroller = require('../Controllers/playlistcontroller');
const middleware = require("../middleware/middleware");


playlistRouter.post('/create', middleware, playlistcontroller.createPlaylist);
playlistRouter.post('/:id/addsong', middleware, playlistcontroller.addSongToPlaylist);
playlistRouter.delete('/:id/removesong', middleware, playlistcontroller.removeSongFromPlaylist); 
playlistRouter.get('/userplaylists', middleware, playlistcontroller.getUserPlaylists);
playlistRouter.delete('/:id/delete', middleware, playlistcontroller.deleteplaylist);
playlistRouter.get('/:id', middleware, playlistcontroller.getPlaylistById);
playlistRouter.put('/:id/update', middleware, playlistcontroller.updatePlaylist);

module.exports = playlistRouter;
