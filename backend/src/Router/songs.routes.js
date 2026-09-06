const express=require('express');
const Songsrouter=express.Router();
const songscontroller=require('../Controllers/songscontroller')
const multer=require('multer');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
const middleware=require('../middleware/middleware');

Songsrouter.post('/upload',upload.single('file'),middleware,songscontroller.uploadSong);
Songsrouter.get('/all',songscontroller.getAllSongs);
Songsrouter.get('/song/:id',songscontroller.getSongsByUser);
Songsrouter.get('/songbyid/:id',songscontroller.getSongById);
Songsrouter.put('/song/:id',songscontroller.updateSong);
Songsrouter.delete('/song/:id',songscontroller.deleteSong);
Songsrouter.get('/mysongs',songscontroller.getMySongs);
module.exports=Songsrouter;