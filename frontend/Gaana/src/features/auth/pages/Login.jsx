import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../../app/context/Authcontext";
import AuthForm from "../components/AuthForm";

function Login() {
    const navigate = useNavigate();

    const {login,loading} = useAuthContext();

    const [error,setError] = useState(null);

    const handleLogin = async (formData) => {
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
        <AuthForm
            type="login"
            onSubmit={handleLogin}
            loading={loading}
            error={error}
        />
    )
}

export default Login;