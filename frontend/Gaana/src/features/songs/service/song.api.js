import api from "../../../core/api/axios";

export const uploadSong = async (formData) => {
    const response = await api.post("/songs/upload", formData);

    return response.data;
};

export const getAllSongs = async () => {
    const response = await api.get("/songs/all");

    return response.data;
};

export const getMySongs = async () => {
    const response = await api.get("/songs/mysongs");

    return response.data;
};

export const getSongById = async (id) => {
    const response = await api.get(`/songs/songbyid/${id}`);

    return response.data;
};

export const deleteSong = async (id) => {
    const response = await api.delete(`/songs/song/${id}`);

    return response.data;
};

export const updateSong = async (id, formData) => {
    const response = await api.put(`/songs/song/${id}`, formData);

    return response.data;
};