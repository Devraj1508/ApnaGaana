import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthContext} from '../../../app/context/Authcontext';

function Register() {
    const navigate = useNavigate();
    const {register, loading} = useAuthContext();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    const [error, setError] = useState(null);

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
            const data = await register(formData);
            if(data.user){
                navigate('/login');
            }
        }catch(err){
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
            {error && <p>{error}</p>}
        </form>
    )
}

export default Register;