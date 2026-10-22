import api from "../../../core/api/axios";

export const getUserProfile = async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
};

export const updateUserProfile = async (profile) => {
    const response = await api.put("/users/profileupdate", profile);
    return response.data;
};

export const getUserSongs = async (userId) => {
    const response = await api.get(`/songs/song/${userId}`);
    return response.data.songs;
};
