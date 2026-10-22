import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    addSongToPlaylist,
    getPlaylistById
} from "../service/playlist.api";
import { getAllSongs } from "../../songs/service/song.api";
import "../style/playliststyle.scss";

function AddSongsToPlaylist() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [addingSongId, setAddingSongId] = useState("");
    const [error, setError] = useState("");

    const loadSongs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [playlistData, songsData] = await Promise.all([
                getPlaylistById(id),
                getAllSongs()
            ]);

            setPlaylist(playlistData.playlist);
            setSongs(Array.isArray(songsData) ? songsData : songsData.songs || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load songs."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadSongs();
    }, [loadSongs]);

    const playlistSongIds = useMemo(
        () =>
            new Set(
                (playlist?.songs || []).map((song) =>
                    typeof song === "string" ? song : song._id
                )
            ),
        [playlist]
    );

    const filteredSongs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return songs.filter((song) => {
            const title = (song.title || "").toLowerCase();
            const artist = (
                song.uploadedBy?.username || song.artist || ""
            ).toLowerCase();

            return title.includes(query) || artist.includes(query);
        });
    }, [searchQuery, songs]);

    const handleAddSong = async (songId) => {
        try {
            setAddingSongId(songId);
            setError("");
            await addSongToPlaylist(id, songId);
            setPlaylist((currentPlaylist) => ({
                ...currentPlaylist,
                songs: [...(currentPlaylist.songs || []), songId]
            }));
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to add song."
            );
        } finally {
            setAddingSongId("");
        }
    };

    if (loading) {
        return <div className="playlists-page">Loading songs...</div>;
    }

    return (
        <div className="playlists-page add-songs-page">
            <button type="button" onClick={() => navigate(`/playlists/${id}`)}>
                ← Back to playlist
            </button>

            <div className="add-songs-heading">
                <p className="eyebrow">ADD SONGS TO PLAYLIST</p>
                <h1>{playlist?.name || "Playlist"}</h1>
                <p>Choose songs to add to your playlist.</p>
            </div>

            <input
                className="song-search"
                type="search"
                placeholder="Search by song title or artist..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <div className="song-picker">
                {filteredSongs.map((song) => {
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
                                disabled={alreadyAdded || addingSongId === song._id}
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

                {filteredSongs.length === 0 && (
                    <p>No matching songs found.</p>
                )}
            </div>
        </div>
    );
}

export default AddSongsToPlaylist;
