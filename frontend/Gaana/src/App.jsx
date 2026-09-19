import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./features/auth/components/AuthForm";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<h1>Welcome to Apna Gaana</h1>} />

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

