import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../style/auth.scss";

const AuthForm = ({ type = "login" }) => {
    const isLogin = type === "login";

    const navigate = useNavigate();

    const {
        login,
        register,
        loading,
        error
    } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                await login({
                    email: formData.email,
                    password: formData.password,
                });

                navigate("/");
            } else {
                await register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });

                navigate("/login");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">
                    <h1>
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>

                    <p>
                        {isLogin
                            ? "Login to continue to Apna Gaana"
                            : "Create your account to continue to Apna Gaana"}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* Username - Register only */}
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="input-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Register"}
                    </button>

                </form>

                {/* Footer */}
                <div className="auth-footer">
                    {isLogin ? (
                        <>
                            <span style={{ color: "#777777" }}>
                                Don't have an account?{" "}
                            </span>

                            <Link
                                to="/register"
                                style={{
                                    color: "#1db954",
                                    fontWeight: "600",
                                    textDecoration: "none"
                                }}
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <span style={{ color: "#777777" }}>
                                Already have an account?{" "}
                            </span>

                            <Link
                                to="/login"
                                style={{
                                    color: "#1db954",
                                    fontWeight: "600",
                                    textDecoration: "none"
                                }}
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthForm;