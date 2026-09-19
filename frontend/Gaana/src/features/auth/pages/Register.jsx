import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthContext} from '../../../app/context/Authcontext';
import AuthForm from '../components/AuthForm';

function Register() {
    const navigate = useNavigate();
    const {register, loading} = useAuthContext();

    
    const [error, setError] = useState(null);

    const handleRegister = async (formData) => {
        setError(null);
        try{
            const data = await register(formData);
            if(data.user){
                navigate('/login');
            }
        }catch(err){
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <AuthForm
            type="register"
            onSubmit={handleRegister}
            loading={loading}
            error={error}
        />
    )
}

export default Register;