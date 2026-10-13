
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyLikedSongs } from "../service/like.api";
import SongCard from "../../discovery/components/SongCard";

function LikedSongs() {
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getMyLikedSongs();

                // Controller returns an array of Like documents.
                const songs = (data.likes || [])
                    .filter((like) => like.song)
                    .map((like) => like.song);

                setLikedSongs(songs);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load liked songs"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLikedSongs();
    }, []);

    if (loading) {
        return <div className="liked-songs-page">Loading liked songs...</div>;
    }

    if (error) {
        return <div className="liked-songs-page">{error}</div>;
    }

    return (
        <div className="liked-songs-page">
            <button onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h1>❤️ Liked Songs</h1>
            <p>{likedSongs.length} songs</p>

            {likedSongs.length === 0 ? (
                <p>You haven't liked any songs yet.</p>
            ) : (
                <div className="song-grid">
                    {likedSongs.map((song) => (
                        <SongCard
                            key={song._id}
                            song={song}
                            songs={likedSongs}
                            title={song.title}
                            artist={song.uploadedBy?.username}
                            image={song.cover}
                            audio={song.audio}
                            onUnlike={(songId) => {
                                    setLikedSongs((prev) =>
                                    prev.filter((item) => item._id !== songId)
                                             );
                                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LikedSongs;
