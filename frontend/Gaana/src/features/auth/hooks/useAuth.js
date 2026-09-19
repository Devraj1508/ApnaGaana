import {useState} from 'react';
import {registerUser, loginUser, getCurrentUser as fetchCurrentUser, logoutUser} from '../service/auth.api';


const useAuth = () => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const register = async (userData) => {
        try{
            setLoading(true);
            setError(null);
            const data = await registerUser(userData);
            return data;
        }catch(err){
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }finally{
            setLoading(false);
        }
    };

    const login = async (userData) => {
        try{
            setLoading(true);
            setError(null);
            const data = await loginUser(userData);

            if(data.user){
                setUser(data.user);
            }
            return data;
        }catch(err){
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }finally{
            setLoading(false);
        }
    };

    const getCurrentUser = async () => {
        try{
            setLoading(true);
            setError(null);
            const data = await fetchCurrentUser();
            if(data.user){
                setUser(data.user);
            }
            return data;
        }catch(err){
            setError(err.response?.data?.message || 'Failed to get current user');
            throw err;
        }finally{
            setLoading(false);
        }
    };

    const logout = async () => {
        try{
            setLoading(true);
            setError(null);
            const data = await logoutUser();
            setUser(null);
            return data;
        }catch(err){
            setError(err.response?.data?.message || 'Logout failed');
            throw err;
        }finally{
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        register,
        login,
        getCurrentUser,
        logout
    };
};

export default useAuth;