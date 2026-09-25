import { useLocation, useNavigate } from "react-router-dom";
import { useMusicContext } from "../../../app/context/MusicContext";
import "../style/Song_Details.scss";

function SongDetails() {
    const location = useLocation();
    const navigate = useNavigate();

   const {
    currentSong,
    isPlaying,
    isShuffle,
    repeatMode,

    playSong,
    togglePlayPause,
    playNextSong,
    playPreviousSong,

    toggleShuffle,
    toggleRepeat,

    currentTime,
    duration,
    seekTo,

    volume,
    isMuted,
    changeVolume,
    toggleMute
} = useMusicContext();
    const song = location.state?.song;
    const songs = location.state?.songs || [];

    const displaySong = currentSong || song;

    if (!song) {
        return (
            <div className="song-details-page">
                <h2>Song not found</h2>

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>
            </div>
        );
    }

    const isCurrentSong =
    currentSong?.audio === displaySong?.audio;

    const handlePlay = () => {
    if (isCurrentSong) {
        togglePlayPause();
    } else {
        playSong(displaySong, songs);
    }
};

    const handleSeek = (e) => {
        const newTime = Number(e.target.value);
        seekTo(newTime);
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) {
            return "00:00";
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;
    };

    return (
        <div className="song-details-page">

            {/* BACK BUTTON */}

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>


            {/* MAIN SONG CARD */}

            <div className="song-details-container">

                {/* COVER */}

                <div className="song-details-cover">

                    {displaySong.cover ? (
                        <img
                            src={displaySong.cover}
                            alt={displaySong.title}
                        />
                    ) : (
                        <span>♪</span>
                    )}

                </div>


                {/* SONG INFORMATION */}

                <div className="song-details-info">

                    <p className="song-type">
                        SONG
                    </p>

                    <h1>
                        <h1>{displaySong?.title}</h1>
                    </h1>

                    <h3>
                        {song.uploadedBy?.username || "Unknown Artist"}
                    </h3>


                    {/* =====================
                        MUSIC CONTROLS
                    ====================== */}

                    <div className="song-details-controls">

                        {/* SHUFFLE */}

                        <button
                            type="button"
                            className={`detail-control ${
                                isShuffle ? "active" : ""
                            }`}
                            onClick={toggleShuffle}
                            title="Shuffle"
                        >
                            <span className="detail-icon-box">
                                🔀
                            </span>
                        </button>


                        {/* PREVIOUS */}

                        <button
                            type="button"
                            className="detail-control"
                            onClick={playPreviousSong}
                            title="Previous"
                        >
                            ⏮
                        </button>


                        {/* PLAY / PAUSE */}

                        <button
                        type="button"
                        className={`detail-play-button ${
                        isCurrentSong && isPlaying ? "playing" : ""
                        }`}
                        onClick={handlePlay}
                        >
                       {isCurrentSong && isPlaying
                       ? "❚❚"
                       : "▶"}
                       </button>


                        {/* NEXT */}

                        <button
                            type="button"
                            className="detail-control"
                            onClick={playNextSong}
                            title="Next"
                        >
                            ⏭
                        </button>


                        {/* REPEAT */}

                        <button
                            type="button"
                            className={`detail-control ${
                                repeatMode !== "off"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={toggleRepeat}
                            title="Repeat"
                        >
                            <span className="detail-icon-box">
                                {repeatMode === "one"
                                    ? "🔂"
                                    : "🔁"}
                            </span>
                        </button>

                    </div>


                    {/* =====================
                        MODE BADGES
                    ====================== */}

                    <div className="play-mode">

                        {isShuffle && (
                            <span className="mode-badge">
                                🔀 Shuffle
                            </span>
                        )}

                        {repeatMode !== "off" && (
                            <span className="mode-badge">
                                {repeatMode === "one"
                                    ? "🔂 Repeat One"
                                    : "🔁 Repeat All"}
                            </span>
                        )}

                    </div>


                    {/* =====================
                        PROGRESS
                    ====================== */}

                    <div className="detail-progress">

                        <span>
                            {formatTime(currentTime)}
                        </span>

                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="detail-progress-bar"
                        />

                        <span>
                            {formatTime(duration)}
                        </span>

                    </div>


                    {/* =====================
                        VOLUME
                    ====================== */}

                    <div className="detail-volume">

                        <button
                            type="button"
                            className="volume-button"
                            onClick={toggleMute}
                            title="Mute"
                        >
                            {isMuted || volume === 0
                                ? "🔇"
                                : "🔊"}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={
                                isMuted
                                    ? 0
                                    : volume
                            }
                            onChange={(e) =>
                                changeVolume(
                                    Number(e.target.value)
                                )
                            }
                            className="detail-volume-slider"
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SongDetails;