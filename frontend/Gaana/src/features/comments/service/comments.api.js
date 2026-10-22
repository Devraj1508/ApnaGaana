import api from "../../../core/api/axios";

export const getComments = async (songId) => {
    const response = await api.get(`/comments/comments/${songId}`);
    return response.data.comments;
};

export const addComment = async (songId, comment) => {
    const response = await api.post(`/comments/comment/${songId}`, { comment });
    return response.data.comment;
};

export const updateComment = async (commentId, comment) => {
    const response = await api.put(`/comments/comment/${commentId}`, { comment });
    return response.data.comment;
};

export const deleteComment = async (commentId) => {
    await api.delete(`/comments/comment/${commentId}`);
};
