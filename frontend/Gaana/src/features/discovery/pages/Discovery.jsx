import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../app/context/Authcontext";
import SongCard from "../components/SongCard";
import useDiscovery from "../hooks/useDiscovery";
import MusicPlayer from "../../songs/components/MusicPlayer";
import "../style/Discovery.scss";

function Discovery() {
    const { user, logout, loading: authLoading } = useAuthContext();

    const {
        discoveryData,
        loading,
        error,
        searchLoading,
        searchResults,
        searchError,
        hasSearched,
        findSongs,
        clearSearch,
        replaceSong,
        removeSong
    } = useDiscovery(!authLoading && Boolean(user));

    const [searchQuery, setSearchQuery] = useState("");
    const searchTimerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, navigate, user]);

    const handleSearchQueryChange = (event) => {
        const nextQuery = event.target.value;
        setSearchQuery(nextQuery);

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        if (!nextQuery.trim()) {
            clearSearch();
            return;
        }

        searchTimerRef.current = setTimeout(() => {
            findSongs(nextQuery);
        }, 350);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        clearSearch();
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }
    };

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
                <button
                    type="button"
                    className="profile-button"
                    onClick={() => {
                        const userId = user?._id || user?.id;
                        if (userId) {
                            navigate(`/profile/${userId}`);
                        }
                    }}
                    disabled={!user?._id && !user?.id}
                >
                    Profile
                </button>

                <div>
                    <h1>Discover Music</h1>
                    <p>Find your next favourite song</p>
                </div>

                {user && (
                    <button
                        type="button"
                        className="logout-button"
                        onClick={logout}
                        disabled={authLoading}
                    >
                        {authLoading ? "Logging out..." : "Logout"}
                    </button>
                )}
            </div>

            <button
                type="button"
                className="add-song-button"
                onClick={() => navigate("/add-song")}
            >
                + Add Song
            </button>


            {/* Search */}
            <div className="search-section">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder="What do you want to play?"
                    aria-label="Search songs, artists, and albums"
                />

                {searchQuery && (
                    <button
                        type="button"
                        className="clear-search-button"
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>

            {hasSearched && (
                <section className="discovery-section search-results-section">
                    <div className="search-results-heading">
                        <h2>Search results for “{searchQuery}”</h2>
                        {searchLoading && <span>Searching...</span>}
                    </div>

                    {searchError && <p className="search-message search-error">{searchError}</p>}

                    {!searchError && !searchLoading && searchResults.length === 0 && (
                        <p className="search-message">No songs found. Try another title or artist.</p>
                    )}

                    {searchResults.length > 0 && !searchLoading && (
                        <div className="search-song-list">
                            {searchResults.map((song) => (
                                <div className="search-song-item" key={song._id}>
                                    <SongCard
                                    key={song._id}
                                    song={song}
                                    songs={searchResults}
                                    title={song.title}
                                    artist={song.artist || song.uploadedBy?.username}
                                    image={song.cover}
                                    audio={song.audio}
                                    onSongUpdated={replaceSong}
                                    onSongDeleted={removeSong}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Quick Access */}
            <section className="discovery-section">

                <h2>Quick Access</h2>

                <div className="category-grid">

                    <div
                    className="category-card"
                    onClick={() => navigate("/liked-songs")}>
                        <span>❤️</span>
                        <h3>Liked Songs</h3>
                        <p>Your favourite songs</p>
                    </div>

                    <div
                    className="category-card"
                    onClick={() => navigate("/recently-played")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            navigate("/recently-played");
                        }
                    }}>
                        <span>🕒</span>
                        <h3>Recently Played</h3>
                        <p>Listen again</p>
                    </div>

           <div
           className="category-card"
            onClick={() => navigate("/playlists")}
           role="button"
           tabIndex={0}
           onKeyDown={(e) => {
            if (e.key === "Enter") {
            navigate("/playlists");
                }
           }}
          >
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
                        artist={song.artist || song.uploadedBy?.username}
                        image={song.cover}
                        audio={song.audio}
                        onSongUpdated={replaceSong}
                        onSongDeleted={removeSong}
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
                        artist={song.artist || song.uploadedBy?.username}
                        image={song.cover}
                        audio={song.audio}
                        onSongUpdated={replaceSong}
                        onSongDeleted={removeSong}
                        />

                    ))}

                </div>

            </section>


            {/* Recently Played */}
            <section className="discovery-section">

                <h2>Recently Played</h2>

                <div className="song-grid recently-played-grid">

                    {discoveryData?.recentlyPlayed?.map((song) => (

                        <SongCard
                         key={song._id}
                        song={song}
                        songs={discoveryData.recentlyPlayed}
                        title={song.title}
                        artist={song.artist || song.uploadedBy?.username}
                        image={song.cover}
                        audio={song.audio}
                        onSongUpdated={replaceSong}
                        onSongDeleted={removeSong}
                        />

                    ))}

                </div>

            </section>

             <MusicPlayer />

        </div>
    );
}

export default Discovery;