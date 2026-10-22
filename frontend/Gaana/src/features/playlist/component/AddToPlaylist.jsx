
import { useState } from "react";
import usePlaylists from "../hooks/useplaylist";
import "../style/playliststyle.scss";

function AddToPlaylist({ songId }) {
    const {
        playlists,
        loading,
        addSong
    } = usePlaylists();

    const [showPlaylists, setShowPlaylists] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState("");

  
const handleAdd = async (e, playlistId = selectedPlaylistId) => {
    e.stopPropagation();

    if (!songId) {
        return;
    }

    try {
        setAdding(true);
        setMessage("");

        const result = await addSong(
            playlistId,
            songId
        );

        setMessage(result.message);
        setShowPlaylists(false);
    } finally {
        setAdding(false);
    }
};


    if (loading) {
        return <span>Loading playlists...</span>;
    }

    if (!playlists.length) {
        return (
            <p className="add-playlist-message">
                Create a playlist first.
            </p>
        );
    }

    const handlePlaylistSelect = async (playlistId) => {
        setSelectedPlaylistId(playlistId);
        await handleAdd({
            stopPropagation: () => {}
        }, playlistId);
    };

    return (
        <div
            className="add-to-playlist"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                type="button"
                className="add-to-playlist-button"
                onClick={() => {
                    setShowPlaylists((visible) => !visible);
                    setMessage("");
                }}
                disabled={adding}
            >
                {adding ? "Adding..." : "+ Add to playlist"}
            </button>

            {showPlaylists && !adding && (
                <div className="playlist-options">
                    {playlists.map((playlist) => (
                        <button
                            type="button"
                            key={playlist._id}
                            onClick={() => handlePlaylistSelect(playlist._id)}
                        >
                            {playlist.name}
                        </button>
                    ))}
                </div>
            )}

            {message && (
                <small role="status">{message}</small>
            )}
        </div>
    );
}

export default AddToPlaylist;
