import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";

const useMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const [repeatMode, setRepeatMode] = useState("off");
    const repeatModeRef = useRef("off");

    const [isShuffle, setIsShuffle] = useState(false);
    const isShuffleRef = useRef(false);

    const shuffleHistoryRef = useRef([]);
    const shufflePositionRef = useRef(-1);

    const soundRef = useRef(null);

    // Latest playlist and index
    const playlistRef = useRef([]);
    const currentIndexRef = useRef(-1);

    // =========================================================
    // PLAY SONG
    // =========================================================

    const playSong = (
        song,
        songs = playlistRef.current,
        index = -1
    ) => {
        console.log("================================");
        console.log("PLAY SONG CALLED");
        console.log("Song:", song?.title);
        console.log("ID:", song?._id);
        console.log("Audio:", song?.audio);
        console.log("================================");

        // =====================================================
        // CHECK AUDIO
        // =====================================================

        if (!song?.audio) {
            console.error("No audio URL provided.");
            return;
        }

        // =====================================================
        // STOP AND REMOVE EVERY PREVIOUS AUDIO INSTANCE
        // =====================================================

        console.log("Stopping ALL previous audio...");

        // Remove old reference first.
        // This prevents callbacks from the old song
        // from changing the new song's state.
        const oldSound = soundRef.current;

        soundRef.current = null;

        // Stop old sound
        if (oldSound) {
            try {
                oldSound.stop();
            } catch (error) {
                console.error(
                    "Error stopping old sound:",
                    error
                );
            }

            try {
                oldSound.unload();
            } catch (error) {
                console.error(
                    "Error unloading old sound:",
                    error
                );
            }
        }

        // Safety:
        // Stop every Howler sound
        Howler.stop();

        // Remove every Howler sound
        Howler.unload();

        // =====================================================
        // RESET PLAYER STATE
        // =====================================================

        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        // =====================================================
        // UPDATE PLAYLIST
        // =====================================================

        if (songs && songs.length > 0) {
            playlistRef.current = songs;
            setPlaylist(songs);

            let songIndex = index;

            if (songIndex === -1) {
                songIndex = songs.findIndex(
                    (item) => item._id === song._id
                );
            }

            currentIndexRef.current = songIndex;
            setCurrentIndex(songIndex);
        }

        // =====================================================
        // UPDATE CURRENT SONG
        // =====================================================

        setCurrentSong(song);

        // =====================================================
        // CREATE NEW HOWL
        // =====================================================

        console.log(
            "Creating new Howl:",
            song.title
        );

        console.log(
            "Audio URL:",
            song.audio
        );

        const sound = new Howl({

            src: [song.audio],

            // Use Web Audio instead of the HTML5 audio element.
            // This gives every selected song a fresh audio instance.
            html5: false,

            volume: isMuted ? 0 : volume,

            // =================================================
            // LOADED
            // =================================================

            onload: () => {

                console.log(
                    "LOADED:",
                    song.title
                );

                if (soundRef.current === sound) {
                    setDuration(
                        sound.duration()
                    );
                }
            },

            // =================================================
            // PLAY
            // =================================================

            onplay: () => {

                console.log(
                    "NOW PLAYING:",
                    song.title
                );

                if (soundRef.current === sound) {
                    setIsPlaying(true);
                }
            },

            // =================================================
            // PAUSE
            // =================================================

            onpause: () => {

                if (soundRef.current === sound) {
                    setIsPlaying(false);
                }
            },

            // =================================================
            // STOP
            // =================================================

            onstop: () => {

                if (soundRef.current === sound) {
                    setIsPlaying(false);
                }
            },

            // =================================================
            // SONG END
            // =================================================

            onend: () => {

                console.log(
                    "SONG ENDED:",
                    song.title
                );

                // Ignore old/stale sound
                if (soundRef.current !== sound) {
                    return;
                }

                setIsPlaying(false);
                setCurrentTime(0);

                // =================================================
                // REPEAT ONE
                // =================================================

                if (
                    repeatModeRef.current === "one"
                ) {

                    playSong(
                        song,
                        playlistRef.current,
                        currentIndexRef.current
                    );

                    return;
                }

                // =================================================
                // SHUFFLE
                // =================================================

                if (
                    isShuffleRef.current
                ) {

                    playNextSong();

                    return;
                }

                // =================================================
                // REPEAT ALL
                // =================================================

                if (
                    repeatModeRef.current === "all"
                ) {

                    playNextSong();

                    return;
                }

                // =================================================
                // PLAYLIST FINISHED
                // =================================================

                console.log(
                    "Playlist finished"
                );
            },

            // =================================================
            // LOAD ERROR
            // =================================================

            onloaderror: (id, error) => {

                console.error(
                    "Audio loading error:",
                    song.title,
                    error
                );
            },

            // =================================================
            // PLAY ERROR
            // =================================================

            onplayerror: (id, error) => {

                console.error(
                    "Audio playing error:",
                    song.title,
                    error
                );
            }
        });

        // =====================================================
        // STORE NEW SOUND
        // =====================================================

        soundRef.current = sound;

        // =====================================================
        // PLAY NEW SONG
        // =====================================================

        console.log(
            "Starting new song:",
            song.title
        );

        sound.play();
    };

    // =========================================================
    // PAUSE
    // =========================================================

    const pauseSong = () => {

        if (!soundRef.current) {
            return;
        }

        soundRef.current.pause();

        setIsPlaying(false);
    };

    // =========================================================
    // RESUME
    // =========================================================

    const resumeSong = () => {

        if (!soundRef.current) {
            return;
        }

        soundRef.current.play();

        setIsPlaying(true);
    };

    // =========================================================
    // TOGGLE PLAY / PAUSE
    // =========================================================

    const togglePlayPause = () => {

        if (!soundRef.current) {
            return;
        }

        if (
            soundRef.current.playing()
        ) {

            pauseSong();

        } else {

            resumeSong();
        }
    };

    // =========================================================
    // NEXT SONG
    // =========================================================

    const playNextSong = () => {

        const songs =
            playlistRef.current;

        const index =
            currentIndexRef.current;

        if (songs.length === 0) {
            return;
        }

        let nextIndex;

        // =====================================================
        // SHUFFLE MODE
        // =====================================================

        if (isShuffleRef.current) {

            // First shuffle play
            if (
                shuffleHistoryRef.current.length === 0
            ) {

                shuffleHistoryRef.current.push(
                    index
                );

                shufflePositionRef.current = 0;
            }

            // Previous ke baad Next dabaya
            if (
                shufflePositionRef.current <
                shuffleHistoryRef.current.length - 1
            ) {

                shufflePositionRef.current++;

                nextIndex =
                    shuffleHistoryRef.current[
                        shufflePositionRef.current
                    ];

            } else {

                // Find songs which haven't been played
                const availableIndexes =
                    songs
                        .map((_, i) => i)
                        .filter(
                            (i) =>
                                !shuffleHistoryRef.current.includes(
                                    i
                                )
                        );

                // All songs played
                if (
                    availableIndexes.length === 0
                ) {

                    // New shuffle cycle
                    shuffleHistoryRef.current =
                        [index];

                    shufflePositionRef.current = 0;

                    const possibleIndexes =
                        songs
                            .map((_, i) => i)
                            .filter(
                                (i) => i !== index
                            );

                    if (
                        possibleIndexes.length === 0
                    ) {
                        return;
                    }

                    nextIndex =
                        possibleIndexes[
                            Math.floor(
                                Math.random() *
                                possibleIndexes.length
                            )
                        ];

                    shuffleHistoryRef.current.push(
                        nextIndex
                    );

                    shufflePositionRef.current = 1;

                } else {

                    nextIndex =
                        availableIndexes[
                            Math.floor(
                                Math.random() *
                                availableIndexes.length
                            )
                        ];

                    shuffleHistoryRef.current.push(
                        nextIndex
                    );

                    shufflePositionRef.current++;
                }
            }

        } else {

            // =================================================
            // NORMAL SEQUENTIAL MODE
            // =================================================

            nextIndex =
                index + 1;

            if (
                nextIndex >= songs.length
            ) {

                if (
                    repeatModeRef.current === "all"
                ) {

                    nextIndex = 0;

                } else {

                    console.log(
                        "Playlist finished"
                    );

                    setIsPlaying(false);

                    return;
                }
            }
        }

        const nextSong =
            songs[nextIndex];

        console.log(
            "Next song:",
            nextSong
        );

        console.log(
            "Shuffle:",
            isShuffleRef.current
        );

        console.log(
            "Shuffle history:",
            shuffleHistoryRef.current
        );

        currentIndexRef.current =
            nextIndex;

        setCurrentIndex(
            nextIndex
        );

        playSong(
            nextSong,
            songs,
            nextIndex
        );
    };

    // =========================================================
    // PREVIOUS SONG
    // =========================================================

    const playPreviousSong = () => {

        const songs =
            playlistRef.current;

        if (songs.length === 0) {
            return;
        }

        let previousIndex;

        // =====================================================
        // SHUFFLE PREVIOUS
        // =====================================================

        if (
            isShuffleRef.current &&
            shufflePositionRef.current > 0
        ) {

            shufflePositionRef.current--;

            previousIndex =
                shuffleHistoryRef.current[
                    shufflePositionRef.current
                ];

        } else {

            // =================================================
            // NORMAL PREVIOUS
            // =================================================

            previousIndex =
                currentIndexRef.current - 1;

            if (previousIndex < 0) {
                return;
            }
        }

        const previousSong =
            songs[previousIndex];

        currentIndexRef.current =
            previousIndex;

        setCurrentIndex(
            previousIndex
        );

        playSong(
            previousSong,
            songs,
            previousIndex
        );
    };

    // =========================================================
    // SEEK
    // =========================================================

    const seekTo = (time) => {

        if (!soundRef.current) {
            return;
        }

        const newTime =
            Math.max(
                0,
                Math.min(
                    time,
                    duration
                )
            );

        soundRef.current.seek(
            newTime
        );

        setCurrentTime(
            newTime
        );
    };

    // =========================================================
    // CURRENT TIME UPDATE
    // =========================================================

    useEffect(() => {

        let interval;

        if (
            isPlaying &&
            soundRef.current
        ) {

            interval =
                setInterval(() => {

                    if (!soundRef.current) {
                        return;
                    }

                    const seek =
                        soundRef.current.seek();

                    if (
                        typeof seek === "number"
                    ) {

                        setCurrentTime(
                            seek
                        );
                    }

                }, 500);
        }

        return () => {
            clearInterval(interval);
        };

    }, [isPlaying]);

    // =========================================================
    // VOLUME
    // =========================================================

    const changeVolume = (
        newVolume
    ) => {

        const value =
            Math.max(
                0,
                Math.min(
                    newVolume,
                    1
                )
            );

        setVolume(value);

        if (soundRef.current) {

            soundRef.current.volume(
                value
            );
        }

        if (value > 0) {
            setIsMuted(false);
        }
    };

    // =========================================================
    // MUTE
    // =========================================================

    const toggleMute = () => {

        if (!soundRef.current) {
            return;
        }

        if (isMuted) {

            soundRef.current.volume(
                volume || 1
            );

            setIsMuted(false);

        } else {

            soundRef.current.volume(0);

            setIsMuted(true);
        }
    };

    // =========================================================
    // REPEAT
    // =========================================================

    const toggleRepeat = () => {

        setRepeatMode(
            (currentMode) => {

                let nextMode;

                if (
                    currentMode === "off"
                ) {

                    nextMode = "all";

                } else if (
                    currentMode === "all"
                ) {

                    nextMode = "one";

                } else {

                    nextMode = "off";
                }

                repeatModeRef.current =
                    nextMode;

                return nextMode;
            }
        );
    };

    // =========================================================
    // SHUFFLE
    // =========================================================

    const toggleShuffle = () => {

        setIsShuffle(
            (current) => {

                const next =
                    !current;

                isShuffleRef.current =
                    next;

                shuffleHistoryRef.current =
                    [];

                shufflePositionRef.current =
                    -1;

                console.log(
                    "Shuffle changed:",
                    next
                );

                return next;
            }
        );
    };

    // =========================================================
    // CLEANUP
    // =========================================================

    useEffect(() => {

        return () => {

            soundRef.current = null;

            // Stop and unload ALL Howler instances
            Howler.stop();
            Howler.unload();
        };

    }, []);

    // =========================================================
    // RETURN
    // =========================================================

    return {

        isPlaying,
        currentSong,

        currentTime,
        duration,

        playlist,
        currentIndex,

        volume,
        isMuted,

        repeatMode,
        isShuffle,

        playSong,
        pauseSong,
        resumeSong,
        togglePlayPause,

        playNextSong,
        playPreviousSong,

        seekTo,

        changeVolume,
        toggleMute,

        toggleRepeat,
        toggleShuffle
    };
};

export default useMusic;