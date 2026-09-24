import { useMusicContext } from "../../../app/context/MusicContext";

function MusicPlayer() {
    const {
        currentSong,
    isPlaying,

    currentTime,
    duration,

    volume,
    isMuted,

    pauseSong,
    resumeSong,
    seekTo,

    playNextSong,
    playPreviousSong,
    toggleRepeat,
    changeVolume,
    toggleMute
    } = useMusicContext();

    // Agar koi song select nahi hai
    if (!currentSong) {
        return null;
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseSong();
        } else {
            resumeSong();
        }
    };

    // Seconds ko MM:SS format mein convert karna
    const formatTime = (time) => {
        if (!time || isNaN(time)) {
            return "00:00";
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleSeek = (e) => {
        const newTime = Number(e.target.value);
        seekTo(newTime);
    };

    return (
        <div className="music-player-controls">

    <div className="music-player-buttons">

        <button
            className="music-control-button"
            onClick={playPreviousSong}
        >
            ⏮
        </button>

        <button
            className="music-player-button"
            onClick={handlePlayPause}
        >
            {isPlaying ? "❚❚" : "▶"}
        </button>

        <button
            className="music-control-button"
            onClick={playNextSong}
        >
            ⏭
        </button>

    </div>

    {/* Progress */}
    <div className="music-progress">

        <span>
            {formatTime(currentTime)}
        </span>

        <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="music-progress-bar"
        />

        <span>
            {formatTime(duration)}
        </span>

    </div>

    <div className="music-volume">

    <button
        className="music-volume-button"
        onClick={toggleMute}
    >
        {isMuted || volume === 0 ? "🔇" : "🔊"}
    </button>

    <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => changeVolume(Number(e.target.value))}
        className="music-volume-slider"
    />

</div>

</div>
    );
}

export default MusicPlayer;