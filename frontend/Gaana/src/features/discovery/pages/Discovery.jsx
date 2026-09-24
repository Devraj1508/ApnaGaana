import SongCard from "../components/SongCard";
import useDiscovery from "../hooks/useDiscovery";
import MusicPlayer from "../../songs/components/MusicPlayer";
import "../style/Discovery.scss";

function Discovery() {

    const {
        discoveryData,
        loading,
        error
    } = useDiscovery();

    if (loading) {
        return (
            <div className="discovery-page">
                <h2>Loading discovery...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="discovery-page">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="discovery-page">

            {/* Header */}
            <div className="discovery-header">
                <div>
                    <h1>Discover Music</h1>
                    <p>Find your next favourite song</p>
                </div>

                <button className="profile-button">
                    Profile
                </button>
            </div>


            {/* Search */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search songs, artists..."
                />

                <button>
                    Search
                </button>
            </div>


            {/* Quick Access */}
            <section className="discovery-section">

                <h2>Quick Access</h2>

                <div className="category-grid">

                    <div className="category-card">
                        <span>❤️</span>
                        <h3>Liked Songs</h3>
                        <p>Your favourite songs</p>
                    </div>

                    <div className="category-card">
                        <span>🕒</span>
                        <h3>Recently Played</h3>
                        <p>Listen again</p>
                    </div>

                    <div className="category-card">
                        <span>🎵</span>
                        <h3>Playlists</h3>
                        <p>Your playlists</p>
                    </div>

                </div>

            </section>


            {/* Latest Songs */}
            <section className="discovery-section">

                <h2>Latest Songs</h2>

                <div className="song-grid">

                    {discoveryData?.latestSongs?.map((song) => (

                       <SongCard
                        key={song._id}
                        song={song}
                        songs={discoveryData.latestSongs}
                        title={song.title}
                        artist={song.uploadedBy?.username}
                        image={song.cover}
                        audio={song.audio}
                           />

                    ))}

                </div>

            </section>


            {/* Popular Songs */}
            <section className="discovery-section">

                <h2>Popular Songs</h2>

                <div className="song-grid">

                    {discoveryData?.popularSongs?.map((song) => (

                        <SongCard
                        key={song._id}
                        song={song}
                        songs={discoveryData.popularSongs}
                        title={song.title}
                        artist={song.uploadedBy?.username}
                        image={song.cover}
                        audio={song.audio}
                        />

                    ))}

                </div>

            </section>


            {/* Recently Played */}
            <section className="discovery-section">

                <h2>Recently Played</h2>

                <div className="song-grid">

                    {discoveryData?.recentlyPlayed?.map((song) => (

                        <SongCard
                         key={song._id}
                        song={song}
                        songs={discoveryData.recentlyPlayed}
                        title={song.title}
                        artist={song.uploadedBy?.username}
                        image={song.cover}
                        audio={song.audio}
                        />

                    ))}

                </div>

            </section>

             <MusicPlayer />

        </div>
    );
}

export default Discovery;