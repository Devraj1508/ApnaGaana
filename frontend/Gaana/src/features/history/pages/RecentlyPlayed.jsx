import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SongCard from "../../discovery/components/SongCard";
import { getListeningHistory } from "../../discovery/service/discovery.api";
import "../../discovery/style/Discovery.scss";

function RecentlyPlayed() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const songs = await getListeningHistory();
                setHistory(
                    songs
                        .map((record) => record.song)
                        .filter(Boolean)
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load recently played songs"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <main className="discovery-page">
            <button
                type="button"
                className="profile-button"
                onClick={() => navigate("/")}
            >
                Back to Discover
            </button>

            <section className="discovery-section">
                <h1>Recently Played</h1>

                {loading && <p>Loading your listening history...</p>}
                {error && <p className="like-error">{error}</p>}
                {!loading && !error && history.length === 0 && (
                    <p>You have not played any songs yet.</p>
                )}

                {!loading && !error && history.length > 0 && (
                    <div className="song-grid recently-played-grid">
                        {history.map((song, index) => (
                            <SongCard
                                key={`${song._id}-${index}`}
                                song={song}
                                songs={history}
                                title={song.title}
                                artist={song.artist || song.uploadedBy?.username}
                                image={song.cover}
                                audio={song.audio}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default RecentlyPlayed;
