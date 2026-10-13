
import { useCallback, useEffect, useState } from "react";

import {
    likeSong,
    unlikeSong,
    getLikeStatus
} from "../service/like.api";

const useLikes = (songId) => {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check whether the current user liked this song
    const fetchLikeStatus = useCallback(async () => {
        if (!songId) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getLikeStatus(songId);
            setIsLiked(data.liked);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch like status"
            );
        } finally {
            setLoading(false);
        }
    }, [songId]);

    useEffect(() => {
        fetchLikeStatus();
    }, [fetchLikeStatus]);

    // Like or unlike the current song
    const toggleLike = async () => {
    if (!songId || loading) return false;

    try {
        setLoading(true);
        setError(null);

        if (isLiked) {
            await unlikeSong(songId);
            setIsLiked(false);
        } else {
            await likeSong(songId);
            setIsLiked(true);
        }

        return true;
    } catch (err) {
        if (isLiked && err.response?.status === 404) {
            setIsLiked(false);
            return true;
        }

        setError(
            err.response?.data?.message ||
            "Failed to update like"
        );

        return false;
    } finally {
        setLoading(false);
    }
};
    return {
        isLiked,
        loading,
        error,
        toggleLike,
        fetchLikeStatus
    };
};

export default useLikes;
