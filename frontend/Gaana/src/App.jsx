import { Routes, Route } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Discovery from "./features/discovery/pages/Discovery";
import SongDetails from "./features/songs/pages/SongDetails";


const App = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Discovery />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/song/:id"
                    element={<SongDetails />}
                />
            </Routes>


        </>
    );
};

export default App;
