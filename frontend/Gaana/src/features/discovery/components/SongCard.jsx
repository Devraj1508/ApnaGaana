import { useMusicContext } from "../../../app/context/MusicContext";

function SongCard({
    title,
    artist,
    image,
    audio,
    song,
    songs
}) {
    const {
        playSong,
        currentSong,
        isPlaying,
        togglePlayPause
    } = useMusicContext();

    const handlePlay = () => {
        console.log("PLAY BUTTON CLICKED");
        console.log("Audio URL:", audio);

        if (currentSong?.audio === audio) {
            togglePlayPause();
        } else {
            playSong(song, songs);
        }
    };

    return (
        <div className="song-card">

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

            <div className="song-details">
                <h3>{title}</h3>
                <p>{artist}</p>
            </div>

            <button
                className="play-button"
                onClick={handlePlay}
            >
                {currentSong?.audio === audio && isPlaying
                    ? "❚❚"
                    : "▶"
                }
            </button>

        </div>
    );
}

export default SongCard;