import { useState } from "react";
import { uploadSong } from "../service/song.api";

const useSongs = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addSong = async (songData) => {
        try {
            setLoading(true);
            setError(null);

            const data = await uploadSong(songData);

            return data;

        } catch (err) {

            console.error("Upload song error:", err);

            setError(
                err.response?.data?.error ||
                "Failed to upload song"
            );

            throw err;

        } finally {
            setLoading(false);
        }
    };

    return {
        addSong,
        loading,
        error
    };
};

export default useSongs;