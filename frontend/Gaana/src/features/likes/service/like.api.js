import api from "../../../core/api/axios";

// Like a song
export const likeSong = async (songId) => {
    const response = await api.post(`/likes/like/${songId}`);
    return response.data;
};

// Unlike a song
export const unlikeSong = async (songId) => {
    const response = await api.delete(`/likes/unlike/${songId}`);
    return response.data;
};

// Check whether a song is liked
export const getLikeStatus = async (songId) => {
    const response = await api.get(`/likes/like-status/${songId}`);
    return response.data;
};

// Get all songs liked by the current user
export const getMyLikedSongs = async () => {
    const response = await api.get("/likes/my-likes");
    return response.data;
};