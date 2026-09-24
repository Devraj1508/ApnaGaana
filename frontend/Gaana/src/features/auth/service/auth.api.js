import api from '../../../core/api/axios';

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const loginUser = async (userdata) => {
    const response = await api.post('/auth/login', userdata);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.delete('/auth/logout');
    return response.data;
};