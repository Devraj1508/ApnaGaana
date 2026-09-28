import { Routes, Route } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Discovery from "./features/discovery/pages/Discovery";
import SongDetails from "./features/songs/pages/SongDetails";
import Addsong from "./features/songs/pages/Addsong";

const App = () => {
    return (
        <Routes>

            <Route path="/" element={<Discovery />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/song/:id"
                element={<SongDetails />}
            />

            <Route
                path="/add-song"
                element={<Addsong />}
            />

        </Routes>
    );
};

export default App;