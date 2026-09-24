import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./app/context/Authcontext";
import { MusicProvider } from "./app/context/MusicContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <MusicProvider>
                    <App />
                </MusicProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);