import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../../app/context/Authcontext";

function Login() {
    const navigate = useNavigate();

    const {login,loading} = useAuthContext();

    const [formData,setFormData] = useState({
        email:"",
        password:""
    });

    const [error,setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try{
            const data = await login(formData);
            if(data.user){
                navigate("/");
            }
        }catch(err){
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p>{error}</p>}
        </form>
    )
}

export default Login;