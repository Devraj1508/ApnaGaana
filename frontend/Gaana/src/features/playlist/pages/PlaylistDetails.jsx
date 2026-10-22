
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    addSongToPlaylist,
    getPlaylistById,
    removeSongFromPlaylist
} from "../service/playlist.api";
import SongCard from "../../discovery/components/SongCard";
import { getAllSongs } from "../../songs/service/song.api";
import "../style/playliststyle.scss";

function PlaylistDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSongPicker, setShowSongPicker] = useState(false);
    const [allSongs, setAllSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingSongs, setLoadingSongs] = useState(false);
    const [addingSongId, setAddingSongId] = useState("");
    const [songMessage, setSongMessage] = useState("");
    const fetchPlaylist = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPlaylistById(id);
            setPlaylist({
                ...data.playlist,
                songs: data.playlist?.songs || []
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load playlist."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPlaylist();
    }, [fetchPlaylist]);

    const handleRemoveSong = async (songId) => {
        try {
            await removeSongFromPlaylist(id, songId);

            setPlaylist((prev) => ({
                ...prev,
                songs: prev.songs.filter(
                    (song) => song._id !== songId
                )
            }));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to remove song."
            );
        }
    };

    const handleToggleSongPicker = async () => {
        const shouldOpen = !showSongPicker;
        setShowSongPicker(shouldOpen);
        setSongMessage("");

        if (!shouldOpen || allSongs.length > 0) return;

        try {
            setLoadingSongs(true);
            const data = await getAllSongs();
            setAllSongs(Array.isArray(data) ? data : data.songs || []);
        } catch (err) {
            setSongMessage(
                err.response?.data?.message || "Failed to load songs."
            );
        } finally {
            setLoadingSongs(false);
        }
    };

    const handleAddSong = async (songId) => {
        try {
            setAddingSongId(songId);
            setSongMessage("");
            await addSongToPlaylist(id, songId);
            await fetchPlaylist();
            setSongMessage("Song added successfully.");
        } catch (err) {
            setSongMessage(
                err.response?.data?.message || "Failed to add song."
            );
        } finally {
            setAddingSongId("");
        }
    };

    const playlistSongIds = new Set(
        (playlist?.songs || []).map((song) =>
            typeof song === "string" ? song : song._id
        )
    );
    const filteredSongs = allSongs.filter((song) => {
        const query = searchQuery.trim().toLowerCase();
        const title = (song.title || "").toLowerCase();
        const artist = (
            song.uploadedBy?.username || song.artist || ""
        ).toLowerCase();

        return title.includes(query) || artist.includes(query);
    });

    if (loading) {
        return <div className="playlists-page">Loading playlist...</div>;
    }

    if (error && !playlist) {
        return (
            <div className="playlists-page">
                <p className="error">{error}</p>
                <button onClick={() => navigate("/playlists")}>
                    Back to Playlists
                </button>
            </div>
        );
    }

    if (!playlist) return null;

    return (
        <div className="playlists-page">
            <button onClick={() => navigate("/playlists")}>
                ← Back to Playlists
            </button>

            <div className="playlist-details-header">
                {playlist.covers?.[0] && (
                    <img
                        src={playlist.covers[0]}
                        alt={playlist.name}
                    />
                )}

                <div>
                    <p>Playlist</p>
                    <h1>{playlist.name}</h1>
                    <p>{playlist.description}</p>
                    <p>{playlist.songs?.length || 0} songs</p>
                    <button
                        type="button"
                        className="add-songs-button"
                        onClick={handleToggleSongPicker}
                    >
                        <span aria-hidden="true">+</span> Add song
                    </button>
                </div>
            </div>

            {error && <p className="error">{error}</p>}

            {showSongPicker && (
                <section className="add-songs-section">
                    <h2>Add songs to playlist</h2>
                    <input
                        className="song-search"
                        type="search"
                        placeholder="Search by song title or artist..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />

                    <div className="song-picker">
                        {loadingSongs && <p>Loading songs...</p>}
                        {songMessage && <p>{songMessage}</p>}

                        {!loadingSongs && filteredSongs.map((song) => {
                            const alreadyAdded = playlistSongIds.has(song._id);

                            return (
                                <div className="song-picker-row" key={song._id}>
                                    <div className="song-picker-info">
                                        <strong>{song.title}</strong>
                                        <span>
                                            {song.uploadedBy?.username ||
                                                song.artist ||
                                                "Unknown artist"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={
                                            alreadyAdded ||
                                            addingSongId === song._id
                                        }
                                        onClick={() => handleAddSong(song._id)}
                                    >
                                        {alreadyAdded
                                            ? "Added"
                                            : addingSongId === song._id
                                                ? "Adding..."
                                                : "+ Add"}
                                    </button>
                                </div>
                            );
                        })}

                        {!loadingSongs && filteredSongs.length === 0 && (
                            <p>No matching songs found.</p>
                        )}
                    </div>
                </section>
            )}

            <section className="playlist-songs">
                <h2>Songs</h2>

                {playlist.songs?.length === 0 ? (
                    <p>This playlist is empty. Add songs to get started.</p>
                ) : (
                    <div className="playlist-grid">
                        {playlist.songs?.map((song) => (
                            <div key={song._id} className="playlist-song">
                                <SongCard
                                     key={song._id}
                                     song={song}
                                     songs={playlist.songs}
                                     title={song.title}
                                     artist={song.artist || song.uploadedBy?.username || "Unknown artist"}
                                     image={song.coverImage}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveSong(song._id)
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default PlaylistDetails;
