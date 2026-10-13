import { useMusicContext } from "../../../app/context/MusicContext";
import { useNavigate } from "react-router-dom";
import useLikes from "../../likes/hooks/useLike.js";

function SongCard({
    title,
    artist,
    image,
    song,
    songs,
    onUnlike
}) {
    const navigate = useNavigate();

    const {
        playSong,
        currentSong,
        isPlaying
    } = useMusicContext();
    const {
        isLiked,
        loading: likeLoading,
        error: likeError,
        toggleLike
    } = useLikes(song?._id);

    const handleCardClick = () => {

        // 1. Start / switch the selected song
        playSong(song, songs);

        // 2. Navigate to song details page
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

    return (
        <div
            className="song-card"
            onClick={handleCardClick}
        >

            {/* COVER */}
            <div className="song-cover">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                    />
                ) : (
                    <span>♪</span>
                )}
            </div>

            {/* SONG DETAILS */}
            <div className="song-details">
                <h3>{title}</h3>
                <p>{artist}</p>
            </div>

            {/* PLAY BUTTON */}
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
                 onClick={(e) => {
                     handleLikeClick(e);
                 }}
                disabled={likeLoading}
                aria-label={isLiked ? "Unlike song" : "Like song"}
                title={isLiked ? "Unlike song" : "Like song"}
            >
                {isLiked ? "❤️" : "🤍"}
            </button>

            {likeError && (
                <p className="like-error">{likeError}</p>
            )}

        </div>
    );
}

export default SongCard;