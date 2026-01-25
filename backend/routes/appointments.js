import express from 'express';
import { getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointment);
router.post('/', protect, createAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

export default router;
