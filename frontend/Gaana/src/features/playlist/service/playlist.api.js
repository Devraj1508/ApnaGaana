
import api from "../../../core/api/axios";

// Create playlist
export const createPlaylist = async (playlistData) => {
    const response = await api.post(
        "/playlists/create",
        playlistData
    );
    return response.data;
};

// Get all playlists for logged-in user
export const getUserPlaylists = async () => {
    const response = await api.get(
        "/playlists/userplaylists"
    );
    return response.data;
};

// Get one playlist by ID
export const getPlaylistById = async (playlistId) => {
    const response = await api.get(
        `/playlists/${playlistId}`
    );
    return response.data;
};

// Add song to playlist
export const addSongToPlaylist = async (playlistId, songId) => {
    const response = await api.post(
        `/playlists/${playlistId}/addsong`,
        { songId }
    );
    return response.data;
};

// Remove song from playlist
export const removeSongFromPlaylist = async (playlistId, songId) => {
    const response = await api.delete(
        `/playlists/${playlistId}/removesong`,
        { data: { songId } }
    );
    return response.data;
};

// Update playlist
export const updatePlaylist = async (playlistId, playlistData) => {
    const response = await api.put(
        `/playlists/${playlistId}/update`,
        playlistData
    );
    return response.data;
};

// Delete playlist
export const deletePlaylist = async (playlistId) => {
    const response = await api.delete(
        `/playlists/${playlistId}/delete`
    );
    return response.data;
};
