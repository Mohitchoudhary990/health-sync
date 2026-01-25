import express from 'express';
import { getDepartments, createDepartment } from '../controllers/departmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDepartments);
router.post('/', protect, authorize('admin'), createDepartment);

export default router;
