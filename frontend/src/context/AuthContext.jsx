import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const savedUser = sessionStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { data } = response.data;

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data));
        setUser(data);

        return data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { data } = response.data;

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data));
        setUser(data);

        return data;
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
