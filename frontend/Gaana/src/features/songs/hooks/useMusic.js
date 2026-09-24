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

    const soundRef = useRef(null);

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

                   if (repeatModeRef.current === "one") {
                         playSong(
                            song,
                            playlistRef.current,
                            currentIndexRef.current
                                 );
                    return;
                   }

                    playNextSong();
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

        if (songs.length === 0) {
            return;
        }

        const nextIndex = index + 1;

       if (nextIndex >= songs.length) {

    if (repeatModeRef.current === "all") {
        const firstSong = songs[0];

        currentIndexRef.current = 0;
        setCurrentIndex(0);

        playSong(firstSong, songs, 0);

        return;
    }

    console.log("Playlist finished");

    setIsPlaying(false);
    return;
}

        const nextSong = songs[nextIndex];

        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);

        playSong(nextSong, songs, nextIndex);
    };

    // PREVIOUS SONG
    const playPreviousSong = () => {
        const songs = playlistRef.current;
        const index = currentIndexRef.current;

        if (songs.length === 0) {
            return;
        }

        const previousIndex = index - 1;

        if (previousIndex < 0) {
            return;
        }

        const previousSong = songs[previousIndex];

        currentIndexRef.current = previousIndex;
        setCurrentIndex(previousIndex);

        playSong(previousSong, songs, previousIndex);
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

    playSong,
    pauseSong,
    resumeSong,
    togglePlayPause,

    playNextSong,
    playPreviousSong,

    seekTo,

    changeVolume,
    toggleMute,

    toggleRepeat
    };
};

export default useMusic;