import { Router } from 'express';
import {
    getTeachers,
    updateTeacher,
    deleteTeacher
} from '../controllers/teachersController.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { auth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', auth, getTeachers);
router.put('/:id', auth, updateTeacher);
router.delete('/:id', auth, deleteTeacher);

export default router;