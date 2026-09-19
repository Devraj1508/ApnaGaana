function SongCard({
    title,
    artist,
    image
}) {
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

            <button className="play-button">
                ▶
            </button>

        </div>
    );
}

export default SongCard;