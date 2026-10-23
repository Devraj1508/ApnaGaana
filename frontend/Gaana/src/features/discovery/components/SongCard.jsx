
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusicContext } from "../../../app/context/MusicContext";
import { useAuthContext } from "../../../app/context/Authcontext";
import useLikes from "../../likes/hooks/useLike.js";
import { deleteSong, updateSong } from "../../songs/service/song.api";

const getEntityId = (entity) => {
    if (!entity) {
        return null;
    }

    if (typeof entity === "string" || typeof entity === "number") {
        return entity.toString();
    }

    return (entity._id || entity.id)?.toString() || null;
};

function SongCard({
    title,
    artist,
    image,
    song,
    songs,
    onUnlike,
    onSongUpdated,
    onSongDeleted,
    showUploaderProfile = true,
    showEditButton = false
}) {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [savedSong, setSavedSong] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const cardSong = savedSong || song;
    const [editTitle, setEditTitle] = useState(cardSong?.title || title);
    const [editArtist, setEditArtist] = useState(cardSong?.artist || artist);
    const [editCover, setEditCover] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const uploadedById = getEntityId(cardSong?.uploadedBy);
    const currentUserId = getEntityId(user);
    const canEditDetails = Boolean(
        currentUserId && uploadedById && currentUserId === uploadedById
    );

    const {
        playSong,
        currentSong,
        isPlaying
    } = useMusicContext();

    const {
        isLiked,
        likeCount,
        loading: likeLoading,
        error: likeError,
        toggleLike
    } = useLikes(song?._id);

    const handleCardClick = () => {
        playSong(song, songs);

        navigate(`/song/${song._id}`, {
            state: {
                song,
                songs
            }
        });
    };

    const handleLikeClick = async (e) => {
        e.stopPropagation();

        const wasLiked = isLiked;
        const success = await toggleLike();

        if (success && wasLiked && onUnlike) {
            onUnlike(song._id);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setEditTitle(cardSong.title);
        setEditArtist(cardSong.artist || artist);
        setEditCover(null);
        setEditError(null);
        setDeleteConfirmation(false);
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!canEditDetails && !editCover) {
            setEditError("Choose a cover image before saving.");
            return;
        }

        const formData = new FormData();
        if (canEditDetails) {
            formData.append("title", editTitle.trim());
            formData.append("artist", editArtist.trim());
        }
        if (editCover) {
            formData.append("cover", editCover);
        }

        try {
            setEditLoading(true);
            setEditError(null);
            const { song: updatedSong } = await updateSong(song._id, formData);
            setSavedSong(updatedSong);
            onSongUpdated?.(updatedSong);
            setIsEditing(false);
        } catch (err) {
            setEditError(
                err.response?.data?.error || "Failed to update song"
            );
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setDeleteLoading(true);
            setEditError(null);
            await deleteSong(song._id);
            onSongDeleted?.(song._id);
            setIsEditing(false);
        } catch (err) {
            setEditError(
                err.response?.data?.error || "Failed to delete song"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div
            className="song-card"
            onClick={handleCardClick}
        >
            {(canEditDetails || showEditButton) && !isEditing && (
                <button
                    type="button"
                    className="edit-song-button"
                    onClick={handleEditClick}
                    aria-label={`Edit ${cardSong.title}`}
                    title="Update song cover or details"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="M4 16.5V20h3.5L18.8 8.7l-3.5-3.5L4 16.5Zm16.7-10.3c.4-.4.4-1 0-1.4l-1.5-1.5a1 1 0 0 0-1.4 0l-1.7 1.7 3.5 3.5 1.1-1.1Z" />
                    </svg>
                </button>
            )}

            {!isEditing && editError && (
                <p className="edit-permission-error">{editError}</p>
            )}

            {isEditing ? (
                <form
                    className="song-edit-form"
                    onSubmit={handleUpdate}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3>{canEditDetails ? "Edit song" : "Add cover image"}</h3>
                    <label>
                        Song title
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            required
                            disabled={!canEditDetails}
                        />
                    </label>
                    <label>
                        Singer name
                        <input
                            type="text"
                            value={editArtist}
                            onChange={(e) => setEditArtist(e.target.value)}
                            required
                            disabled={!canEditDetails}
                        />
                    </label>
                    <label>
                        Cover image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditCover(e.target.files[0] || null)}
                        />
                    </label>
                    {!canEditDetails && (
                        <p className="edit-form-hint">
                            Anyone can add or replace the cover image.
                        </p>
                    )}
                    {editError && <p className="like-error">{editError}</p>}
                    <div className="song-edit-actions">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(false);
                            }}
                            disabled={editLoading}
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={editLoading}>
                            {editLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                    {canEditDetails && !deleteConfirmation && (
                        <button
                            type="button"
                            className="delete-song-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmation(true);
                                setEditError(null);
                            }}
                            disabled={editLoading || deleteLoading}
                        >
                            Delete song
                        </button>
                    )}
                    {canEditDetails && deleteConfirmation && (
                        <div className="delete-confirmation">
                            <p>Are you sure you want to delete this song?</p>
                            <div className="song-edit-actions">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirmation(false)}
                                    disabled={deleteLoading}
                                >
                                    No, keep it
                                </button>
                                <button
                                    type="button"
                                    className="confirm-delete-button"
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? "Deleting..." : "Yes, delete"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            ) : (
                <>
            {/* COVER */}
            <div className="song-cover">
                {cardSong.cover || image ? (
                    <img
                        src={cardSong.cover || image}
                        alt={cardSong.title}
                    />
                ) : (
                    <span>♪</span>
                )}
            </div>

            {/* SONG DETAILS */}
            <div className="song-details">
                <h3>{cardSong.title}</h3>
                <p>{cardSong.artist || artist}</p>
            </div>

            <div className="song-card-actions">
                <button
                    type="button"
                    className="play-button"
                    onClick={(e) => {
                        e.stopPropagation();

                        playSong(song, songs);

                        navigate(`/song/${song._id}`, {
                            state: {
                                song,
                                songs
                            }
                        });
                    }}
                >
                    {currentSong?._id === song?._id && isPlaying
                        ? "❚❚"
                        : "▶"}
                </button>

                <button
                    type="button"
                    className={`like-button ${isLiked ? "liked" : ""}`}
                    onClick={handleLikeClick}
                    disabled={likeLoading}
                    aria-label={isLiked ? "Unlike song" : "Like song"}
                >
                    {isLiked ? "❤️" : "🤍"} <span className="like-count">{likeCount}</span>
                </button>

                {showUploaderProfile && uploadedById && (
                    <button
                        type="button"
                        className="uploader-profile-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${uploadedById}`);
                        }}
                    >
                        {canEditDetails ? "Your profile" : "View profile"}
                    </button>
                )}
            </div>

            {likeError && (
                <p className="like-error">{likeError}</p>
            )}
                </>
            )}
        </div>
    );
}

export default SongCard;
