import {createContext, useContext} from "react";
import useMusic from "../../features/songs/hooks/useMusic";

const MusicContext = createContext(null);

export const MusicProvider = ({children}) => {
    const music = useMusic();

    return (
        <MusicContext.Provider value={music}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusicContext = () => {
    return useContext(MusicContext);
};