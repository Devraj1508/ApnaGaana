import { Routes, Route } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Discovery from "./features/discovery/pages/Discovery";
import SongDetails from "./features/songs/pages/SongDetails";
import Addsong from "./features/songs/pages/Addsong";
import Playlist from "./features/playlist/pages/Playlist";
import PlaylistDetails from "./features/playlist/pages/PlaylistDetails";
import AddSongsToPlaylist from "./features/playlist/pages/AddSongsToPlaylist";
import LikedSongs from "./features/likes/pages/LikedSongs";
import RecentlyPlayed from "./features/history/pages/RecentlyPlayed";
import Profile from "./features/profile/pages/Profile";

const App = () => {
    return (
        <Routes>

            <Route path="/" element={<Discovery />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/song/:id" element={<SongDetails />} />

            <Route path="/playlists" element={<Playlist />} />

            <Route
                path="/playlists/:id"
                element={<PlaylistDetails />}
            />

            <Route
                path="/playlists/:id/add-songs"
                element={<AddSongsToPlaylist />}
            />

            <Route
                path="/add-song"
                element={<Addsong />}
            />

            <Route path="/liked-songs" element={<LikedSongs />} />

            <Route
                path="/recently-played"
                element={<RecentlyPlayed />}
            />

            <Route path="/profile/:id" element={<Profile />} />

        </Routes>

    );
};

export default App;