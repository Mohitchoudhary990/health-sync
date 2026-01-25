import api from '../utils/api';

// @desc    Get all appointments
export const getAppointments = async () => {
    const response = await api.get('/appointments');
    return response.data;
};

// @desc    Get appointment by ID
export const getAppointmentById = async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
};

// @desc    Create new appointment
export const createAppointment = async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
};

// @desc    Update appointment status
export const updateAppointmentStatus = async (id, status) => {
    const response = await api.put(`/appointments/${id}`, { status });
    return response.data;
};

// @desc    Delete appointment
export const deleteAppointment = async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
};
