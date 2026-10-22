import api from "../../../core/api/axios";

export const getDiscoveryData = async () => {
    const response = await api.get("/discovery/discover");

    return response.data;
};

export const searchSongs = async (query) => {
    const response = await api.get("/songs/search", {
        params: { query }
    });

    return response.data.songs;
};

export const getListeningHistory = async () => {
    const response = await api.get("/listening-history/history");

    return response.data.history;
};