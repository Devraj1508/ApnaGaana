
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlaylists from "../hooks/useplaylist";
import {
    updatePlaylist,
    deletePlaylist
} from "../service/playlist.api";
import "../style/playliststyle.scss";

function Playlist() {
    const navigate = useNavigate();

    const {
        playlists,
        loading,
        error,
        createPlaylist,
        fetchPlaylists
    } = usePlaylists();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [covers, setCovers] = useState("");
    const [formError, setFormError] = useState("");
    const [editingPlaylist, setEditingPlaylist] = useState(null);

    // Create playlist
    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!name.trim() || !description.trim() || !covers.trim()) {
            setFormError(
                "Please enter a name, description, and cover image URL."
            );
            return;
        }

        const playlist = await createPlaylist({
            name: name.trim(),
            description: description.trim(),
            covers: [covers.trim()]
        });

        if (playlist) {
            setName("");
            setDescription("");
            setCovers("");
        }
    };

    // Update playlist
    const handleEditPlaylist = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!editingPlaylist) return;

        if (!editingPlaylist.name.trim()) {
            setFormError("Playlist name is required.");
            return;
        }

        try {
            const updated = await updatePlaylist(
                editingPlaylist._id,
                {
                    name: editingPlaylist.name.trim(),
                    description: editingPlaylist.description || "",
                    covers: editingPlaylist.covers || []
                }
            );

            if (updated) {
                setEditingPlaylist(null);
                await fetchPlaylists();
            }
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                "Failed to update playlist."
            );
        }
    };

    // Delete playlist
    const handleDeletePlaylist = async (playlistId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this playlist?"
        );

        if (!confirmed) return;

        setFormError("");

        try {
            await deletePlaylist(playlistId);
            await fetchPlaylists();
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                "Failed to delete playlist."
            );
        }
    };

    if (loading) {
        return (
            <div className="playlists-page">
                Loading playlists...
            </div>
        );
    }

    return (
        <div className="playlists-page">
            <button
                type="button"
                onClick={() => navigate("/")}
            >
                ← Back to Discovery
            </button>

            <h1>My Playlists</h1>
            <p>Create your own music collections.</p>

            {/* CREATE PLAYLIST FORM */}
            <form
                className="playlist-form"
                onSubmit={handleCreatePlaylist}
            >
                <h2>Create a playlist</h2>

                <input
                    type="text"
                    placeholder="Playlist name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <input
                    type="url"
                    placeholder="Cover image URL"
                    value={covers}
                    onChange={(e) => setCovers(e.target.value)}
                    required
                />

                <button type="submit">
                    Create Playlist
                </button>

                {formError && (
                    <p className="error">{formError}</p>
                )}

                {error && (
                    <p className="error">{error}</p>
                )}
            </form>

            {/* EDIT PLAYLIST FORM */}
            {editingPlaylist && (
                <form
                    className="playlist-form"
                    onSubmit={handleEditPlaylist}
                >
                    <h2>Edit Playlist</h2>

                    <input
                        type="text"
                        placeholder="Playlist name"
                        value={editingPlaylist.name}
                        onChange={(e) =>
                            setEditingPlaylist({
                                ...editingPlaylist,
                                name: e.target.value
                            })
                        }
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={editingPlaylist.description || ""}
                        onChange={(e) =>
                            setEditingPlaylist({
                                ...editingPlaylist,
                                description: e.target.value
                            })
                        }
                    />

                    <input
                        type="url"
                        placeholder="Cover image URL"
                        value={editingPlaylist.covers?.[0] || ""}
                        onChange={(e) =>
                            setEditingPlaylist({
                                ...editingPlaylist,
                                covers: e.target.value
                                    ? [e.target.value]
                                    : []
                            })
                        }
                    />

                    <button type="submit">
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={() => setEditingPlaylist(null)}
                    >
                        Cancel
                    </button>

                    {formError && (
                        <p className="error">{formError}</p>
                    )}
                </form>
            )}

            {/* PLAYLIST LIST */}
            <section className="playlist-list">
                <h2>Your playlists ({playlists.length})</h2>

                {!playlists.length ? (
                    <p>
                        You haven't created any playlists yet.
                    </p>
                ) : (
                    <div className="playlist-grid">
                        {playlists.map((playlist) => (
                            <article
                                className="playlist-card"
                                key={playlist._id}
                                onClick={() =>
                                    navigate(
                                        `/playlists/${playlist._id}`
                                    )
                                }
                            >
                                {playlist.covers?.[0] ? (
                                    <img
                                        src={playlist.covers[0]}
                                        alt={playlist.name}
                                    />
                                ) : (
                                    <div className="playlist-cover">
                                        🎵
                                    </div>
                                )}

                                <h3>{playlist.name}</h3>
                                <p>{playlist.description}</p>

                                <span>
                                    {playlist.songs?.length || 0} songs
                                </span>

                                {/* EDIT AND DELETE BUTTONS */}
                                <div className="playlist-actions">
                                    <button
                                        type="button"
                                        className="playlist-edit-button"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            setFormError("");

                                            setEditingPlaylist({
                                                ...playlist,
                                                covers: playlist.covers || []
                                            });
                                        }}
                                        aria-label={`Edit ${playlist.name}`}
                                        title={`Edit ${playlist.name}`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            focusable="false"
                                        >
                                            <path d="M4 16.5V20h3.5L18.8 8.7l-3.5-3.5L4 16.5Zm16.7-10.3c.4-.4.4-1 0-1.4l-1.5-1.5a1 1 0 0 0-1.4 0l-1.7 1.7 3.5 3.5 1.1-1.1Z" />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlaylist(
                                                playlist._id
                                            );
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Playlist;
