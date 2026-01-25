import api from '../utils/api';

// @desc    Get all doctors
export const getDoctors = async () => {
    const response = await api.get('/doctors');
    return response.data;
};

// @desc    Get doctor by ID
export const getDoctorById = async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
};

// @desc    Update doctor profile image
export const updateDoctorImage = async (formData) => {
    const response = await api.put('/doctors/profile-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// @desc    Update doctor availability
export const updateAvailability = async (availabilityData) => {
    const response = await api.put('/doctors/availability/update', availabilityData);
    return response.data;
};

// @desc    Delete doctor
export const deleteDoctor = async (id) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
};
