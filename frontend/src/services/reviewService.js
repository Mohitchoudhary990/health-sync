import api from '../utils/api';

// @desc    Get reviews for a doctor
export const getReviews = async (doctorId) => {
    const response = await api.get(`/reviews/doctor/${doctorId}`);
    return response.data;
};

// @desc    Create new review
export const createReview = async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
};
