import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./features/auth/components/AuthForm";
import Discovery from "./features/discovery/pages/Discovery";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Discovery />} />

            <Route
                path="/login"
                element={<AuthForm mode="login" />}
            />

            <Route
                path="/register"
                element={<AuthForm mode="register" />}
            />
        </Routes>
    );
};

export default App;

