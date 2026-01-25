import api from '../utils/api';

// @desc    Get current user profile
export const getMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

// @desc    Update user profile
export const updateProfile = async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
};

// @desc    Get all users (Admin only)
export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

// @desc    Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
    const response = await api.put(`/users/${userId}`, { role });
    return response.data;
};

// @desc    Delete user (Admin only)
export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};
