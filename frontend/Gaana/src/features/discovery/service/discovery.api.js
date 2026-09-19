import api from "../../../core/api/axios";

export const getDiscoveryData = async () => {
    const response = await api.get("/discovery/discover");

    return response.data;
};