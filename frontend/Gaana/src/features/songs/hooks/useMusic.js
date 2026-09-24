import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

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

    const soundRef = useRef(null);
    const shufflePositionRef = useRef(-1);

    
    // Refs latest playlist/index ko hold karenge
    const playlistRef = useRef([]);
    const currentIndexRef = useRef(-1);

    const playSong = (song, songs = playlistRef.current, index = -1) => {
        console.log("Playing:", song);

        if (!song?.audio) {
            console.error("No audio URL provided.");
            return;
        }

        // Previous song stop
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.unload();
        }

        // Playlist update
        if (songs.length > 0) {
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

        setCurrentTime(0);
        setDuration(0);

        const sound = new Howl({
            src: [song.audio],
            html5: true,
            volume: isMuted ? 0 : volume,

            onload: () => {
                setDuration(sound.duration());
            },

            onplay: () => {
                setIsPlaying(true);
            },

            onpause: () => {
                setIsPlaying(false);
            },

           onend: () => {
    setIsPlaying(false);
    setCurrentTime(0);

    // Repeat ONE
    if (repeatModeRef.current === "one") {
        playSong(
            song,
            playlistRef.current,
            currentIndexRef.current
        );
        return;
    }

    // Shuffle ON
    if (isShuffleRef.current) {
        playNextSong();
        return;
    }

    // Normal playlist + Repeat ALL
    if (repeatModeRef.current === "all") {
        playNextSong();
        return;
    }

    // Playlist finished
    console.log("Playlist finished");
},

            onloaderror: (id, error) => {
                console.error("Audio loading error:", error);
            },

            onplayerror: (id, error) => {
                console.error("Audio playing error:", error);
            }
        });

        soundRef.current = sound;

        setCurrentSong(song);

        sound.play();
    };

    const pauseSong = () => {
        if (!soundRef.current) {
            return;
        }

        soundRef.current.pause();
        setIsPlaying(false);
    };

    const resumeSong = () => {
        if (!soundRef.current) {
            return;
        }

        soundRef.current.play();
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        if (!soundRef.current) {
            return;
        }

        if (soundRef.current.playing()) {
            pauseSong();
        } else {
            resumeSong();
        }
    };

    // NEXT SONG
const playNextSong = () => {
    const songs = playlistRef.current;
    const index = currentIndexRef.current;

    if (songs.length === 0) return;

    let nextIndex;

    if (isShuffleRef.current) {

    // First shuffle play
    if (shuffleHistoryRef.current.length === 0) {
        shuffleHistoryRef.current.push(index);
        shufflePositionRef.current = 0;
    }

    // Agar Previous ke baad Next dabaya
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

        // Unplayed songs find karo
        const availableIndexes = songs
            .map((_, i) => i)
            .filter(
                i => !shuffleHistoryRef.current.includes(i)
            );

        if (availableIndexes.length === 0) {

            // New shuffle cycle
            shuffleHistoryRef.current = [index];
            shufflePositionRef.current = 0;

            const possibleIndexes = songs
                .map((_, i) => i)
                .filter(i => i !== index);

            nextIndex =
                possibleIndexes[
                    Math.floor(
                        Math.random() * possibleIndexes.length
                    )
                ];

            shuffleHistoryRef.current.push(nextIndex);
            shufflePositionRef.current = 1;

        } else {

            nextIndex =
                availableIndexes[
                    Math.floor(
                        Math.random() * availableIndexes.length
                    )
                ];

            shuffleHistoryRef.current.push(nextIndex);
            shufflePositionRef.current++;
        }
    }

} else {

        // Normal sequential mode
        nextIndex = index + 1;

        if (nextIndex >= songs.length) {

            if (repeatModeRef.current === "all") {
                nextIndex = 0;
            } else {
                console.log("Playlist finished");
                setIsPlaying(false);
                return;
            }
        }
    }

    const nextSong = songs[nextIndex];

    console.log("Next song:", nextSong);
    console.log("Shuffle:", isShuffleRef.current);
    console.log("Shuffle history:", shuffleHistoryRef.current);

    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);

    playSong(nextSong, songs, nextIndex);
};
    // PREVIOUS SONG
   const playPreviousSong = () => {
    const songs = playlistRef.current;

    if (songs.length === 0) return;

    let previousIndex;

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
        previousIndex = currentIndexRef.current - 1;

        if (previousIndex < 0) {
            return;
        }
    }

    const previousSong = songs[previousIndex];

    currentIndexRef.current = previousIndex;
    setCurrentIndex(previousIndex);

    playSong(
        previousSong,
        songs,
        previousIndex
    );
};
    // SEEK 
    const seekTo = (time) => {
        if (!soundRef.current) {
            return;
        }

        const newTime = Math.max(
            0,
            Math.min(time, duration)
        );

        soundRef.current.seek(newTime);

        setCurrentTime(newTime);
    };

    // Current time update
    useEffect(() => {
        let interval;

        if (isPlaying && soundRef.current) {
            interval = setInterval(() => {
                const seek = soundRef.current.seek();

                if (typeof seek === "number") {
                    setCurrentTime(seek);
                }
            }, 500);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    const changeVolume = (newVolume) => {
    const value = Math.max(0, Math.min(newVolume, 1));

    setVolume(value);

    if (soundRef.current) {
        soundRef.current.volume(value);
    }

    if (value > 0) {
        setIsMuted(false);
    }
};



const toggleMute = () => {
    if (!soundRef.current) {
        return;
    }

    if (isMuted) {
        soundRef.current.volume(volume || 1);
        setIsMuted(false);
    } else {
        soundRef.current.volume(0);
        setIsMuted(true);
    }
};

    const toggleRepeat = () => {
    setRepeatMode((currentMode) => {

        let nextMode;

        if (currentMode === "off") {
            nextMode = "all";
        } else if (currentMode === "all") {
            nextMode = "one";
        } else {
            nextMode = "off";
        }

        repeatModeRef.current = nextMode;

        return nextMode;
    });
};

const toggleShuffle = () => {
    setIsShuffle(current => {
        const next = !current;

        isShuffleRef.current = next;

        if (!next) {
            shuffleHistoryRef.current = [];
        } else {
            shuffleHistoryRef.current = [];
        }

        console.log("Shuffle changed:", next);

        return next;
    });
};

    // Cleanup
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.stop();
                soundRef.current.unload();
            }
        };
    }, []);

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