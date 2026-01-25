import express from 'express';
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor, updateDoctorAvailability, getDoctorAvailableSlots, updateDoctorProfileImage } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Static routes first
router.get('/', getDoctors);
router.get('/availability/slots', getDoctorAvailableSlots);

// Specific PUT routes
router.put('/availability/update', protect, authorize('doctor'), updateDoctorAvailability);
router.put('/profile-image', protect, authorize('doctor'), upload.single('profileImage'), updateDoctorProfileImage);

// Dynamic routes with :id (must be last)
router.get('/:id', getDoctor);
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

export default router;
