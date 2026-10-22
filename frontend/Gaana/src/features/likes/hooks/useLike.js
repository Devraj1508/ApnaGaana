
import { useCallback, useEffect, useState } from "react";

import {
    likeSong,
    unlikeSong,
    getLikeStatus,
    getLikeCount
} from "../service/like.api";

const useLikes = (songId) => {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [likeCount, setLikeCount] = useState(0);

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

    const fetchLikeCount = useCallback(async () => {
    if (!songId) return;

    try {
        const data = await getLikeCount(songId);
        setLikeCount(data.count);
    } catch (err) {
        console.error("Failed to fetch like count:", err);
    }
}, [songId]);

   useEffect(() => {
    fetchLikeStatus();
    fetchLikeCount();
   }, [fetchLikeStatus, fetchLikeCount]);

    // Like or unlike the current song
    const toggleLike = async () => {
    if (!songId || loading) return false;

    try {
        setLoading(true);
        setError(null);
    if (isLiked) {
    await unlikeSong(songId);
    setIsLiked(false);
    setLikeCount((count) => Math.max(0, count - 1));
   } else {
    await likeSong(songId);
    setIsLiked(true);
    setLikeCount((count) => count + 1);
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
        likeCount,
        fetchLikeStatus
    };
};

export default useLikes;
