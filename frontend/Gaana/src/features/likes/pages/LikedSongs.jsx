
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyLikedSongs } from "../service/like.api";
import SongCard from "../../discovery/components/SongCard";
import "../style/likedsong.scss";

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
        return (
            <div className="liked-songs-page">
                <p className="liked-songs-error">{error}</p>
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    Back to Discover
                </button>
            </div>
        );
    }

    return (
        <div className="liked-songs-page">
            <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <div className="liked-songs-header">
                <div className="liked-songs-icon" aria-hidden="true">
                    ❤️
                </div>
                <div>
                    <p>Collection</p>
                    <h1>Liked Songs</h1>
                    <span>{likedSongs.length} songs</span>
                </div>
            </div>

            {likedSongs.length === 0 ? (
                <div className="liked-songs-empty">
                    <p>You haven't liked any songs yet.</p>
                </div>
            ) : (
                <section className="liked-songs-list">
                    <h2>All liked songs</h2>
                    <div className="liked-song-grid">
                        {likedSongs.map((song) => (
                            <div className="liked-song-card" key={song._id}>
                                <SongCard
                                    song={song}
                                    songs={likedSongs}
                                    title={song.title}
                                    artist={song.artist || song.uploadedBy?.username}
                                    image={song.cover || song.coverImage}
                                    audio={song.audio}
                                    onUnlike={(songId) => {
                                        setLikedSongs((prev) =>
                                            prev.filter((item) => item._id !== songId)
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default LikedSongs;
