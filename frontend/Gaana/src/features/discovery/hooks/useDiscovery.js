import { useEffect, useRef, useState } from "react";
import { getDiscoveryData, searchSongs } from "../service/discovery.api";

const useDiscovery = (enabled = true) => {
    const [discoveryData, setDiscoveryData] = useState(null);
    const [loading, setLoading] = useState(enabled);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState(null);
    const searchRequestRef = useRef(0);

    const fetchDiscoveryData = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getDiscoveryData();

            setDiscoveryData(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load discovery data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled) {
            return;
        }

        void Promise.resolve().then(() => fetchDiscoveryData());
    }, [enabled]);

    const findSongs = async (query) => {
        const trimmedQuery = query.trim();
        searchRequestRef.current += 1;
        const requestId = searchRequestRef.current;

        if (!trimmedQuery) {
            setSearchResults([]);
            setSearchError(null);
            setHasSearched(false);
            return;
        }

        try {
            setSearchLoading(true);
            setSearchError(null);
            setHasSearched(true);
            const songs = await searchSongs(trimmedQuery);

            if (requestId !== searchRequestRef.current) {
                return;
            }

            setSearchResults(songs);
        } catch (err) {
            if (requestId !== searchRequestRef.current) {
                return;
            }

            setSearchError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to search songs"
            );
        } finally {
            setSearchLoading(false);
        }
    };

    const clearSearch = () => {
        searchRequestRef.current += 1;
        setSearchResults([]);
        setSearchError(null);
        setHasSearched(false);
    };

    const replaceSong = (updatedSong) => {
        setDiscoveryData((previousData) => {
            if (!previousData) {
                return previousData;
            }

            const updateSongs = (songs = []) =>
                songs.map((song) =>
                    song._id === updatedSong._id ? updatedSong : song
                );

            return {
                ...previousData,
                latestSongs: updateSongs(previousData.latestSongs),
                popularSongs: updateSongs(previousData.popularSongs),
                recentlyPlayed: updateSongs(previousData.recentlyPlayed)
            };
        });
        setSearchResults((songs) =>
            songs.map((song) =>
                song._id === updatedSong._id ? updatedSong : song
            )
        );
    };

    const removeSong = (songId) => {
        setDiscoveryData((previousData) => {
            if (!previousData) {
                return previousData;
            }

            const withoutSong = (songs = []) =>
                songs.filter((song) => song._id !== songId);

            return {
                ...previousData,
                latestSongs: withoutSong(previousData.latestSongs),
                popularSongs: withoutSong(previousData.popularSongs),
                recentlyPlayed: withoutSong(previousData.recentlyPlayed)
            };
        });
        setSearchResults((songs) =>
            songs.filter((song) => song._id !== songId)
        );
    };

    return {
        discoveryData,
        loading,
        error,
        searchLoading,
        searchResults,
        searchError,
        hasSearched,
        fetchDiscoveryData,
        findSongs,
        clearSearch,
        replaceSong,
        removeSong
    };
};

export default useDiscovery;