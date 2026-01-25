import api from '../utils/api';

// @desc    Register new user
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// @desc    Login user
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};
