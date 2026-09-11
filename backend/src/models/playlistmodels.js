const mongoose = require('mongoose');


const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {  
        type: String,
        trim: true  
    },
    covers: [{
        type: String,
        trim: true
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }]
}, { timestamps: true });   

const playlistmodel = mongoose.model('Playlist', playlistSchema);

module.exports = playlistmodel;
