import express from 'express';
import { createReview, getReviews, getDoctorReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/doctor/:doctorId', getDoctorReviews);

// Protected routes (require authentication)
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
