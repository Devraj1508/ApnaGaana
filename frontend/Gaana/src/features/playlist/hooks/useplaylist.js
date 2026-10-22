
import { useCallback, useEffect, useState } from "react";

import {
    createPlaylist as createPlaylistApi,
    getUserPlaylists,
    addSongToPlaylist as addSongApi,
    removeSongFromPlaylist as removeSongApi,
    deletePlaylist as deletePlaylistApi
} from "../service/playlist.api";

const usePlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all playlists
    const fetchPlaylists = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getUserPlaylists();
            setPlaylists(data.playlists || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch playlists."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlaylists();
    }, [fetchPlaylists]);

    // Create playlist
    const createPlaylist = async (playlistData) => {
        try {
            setError("");

            const data = await createPlaylistApi(playlistData);

            setPlaylists((prev) => [
                data.playlist,
                ...prev
            ]);

            return data.playlist;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to create playlist."
            );
            return null;
        }
    };

  
const addSong = async (playlistId, songId) => {
    try {
        setError("");

        const data = await addSongApi(playlistId, songId);

        setPlaylists((prev) =>
            prev.map((playlist) =>
                playlist._id === playlistId
                    ? data.playlist
                    : playlist
            )
        );

        return {
            success: true,
            message: data.message || "Song added successfully."
        };
    } catch (err) {
        const message =
            err.response?.data?.message ||
            "Failed to add song.";

        setError(message);

        return {
            success: false,
            message
        };
    }
};

    // Remove song from playlist
    const removeSong = async (playlistId, songId) => {
        try {
            setError("");

            const data = await removeSongApi(playlistId, songId);

            setPlaylists((prev) =>
                prev.map((playlist) =>
                    playlist._id === playlistId
                        ? data.playlist
                        : playlist
                )
            );

            return true;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to remove song."
            );
            return false;
        }
    };

    // Delete playlist
    const deletePlaylist = async (playlistId) => {
        try {
            setError("");

            await deletePlaylistApi(playlistId);

            setPlaylists((prev) =>
                prev.filter(
                    (playlist) => playlist._id !== playlistId
                )
            );

            return true;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete playlist."
            );
            return false;
        }
    };

    return {
        playlists,
        loading,
        error,
        fetchPlaylists,
        createPlaylist,
        addSong,
        removeSong,
        deletePlaylist
    };
};

export default usePlaylists;
