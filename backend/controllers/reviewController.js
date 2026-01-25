import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { appointmentId, rating, comment } = req.body;

        // Check if appointment exists
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Check if appointment belongs to the user
        if (appointment.patientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only review your own appointments',
            });
        }

        // Check if appointment is completed
        if (appointment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'You can only review completed appointments',
            });
        }

        // Check if review already exists for this appointment
        const existingReview = await Review.findOne({ appointmentId });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this appointment',
            });
        }

        // Create review
        const review = await Review.create({
            patientId: req.user._id,
            doctorId: appointment.doctorId,
            appointmentId,
            rating,
            comment,
        });

        // Populate patient info
        await review.populate('patientId', 'name profileImage');

        res.status(201).json({
            success: true,
            data: review,
            message: 'Review submitted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all reviews (with optional doctor filter)
export const getReviews = async (req, res) => {
    try {
        const { doctorId } = req.query;
        const query = doctorId ? { doctorId } : {};

        const reviews = await Review.find(query)
            .populate('patientId', 'name profileImage')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name',
                },
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get reviews for a specific doctor
export const getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        const reviews = await Review.find({ doctorId })
            .populate('patientId', 'name profileImage')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reviews.length,
            averageRating: doctor.rating,
            totalReviews: doctor.reviewCount,
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if user is the author
        if (review.patientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own reviews',
            });
        }

        // Update review
        review.rating = rating || review.rating;
        review.comment = comment !== undefined ? comment : review.comment;

        await review.save();

        await review.populate('patientId', 'name profileImage');

        res.json({
            success: true,
            data: review,
            message: 'Review updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if user is the author or admin
        if (review.patientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own reviews',
            });
        }

        await Review.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
