import { Router } from 'express';
import {
    uploadFile
} from '../controllers/uploadController.js';
import multer from 'multer';
import { auth } from '../middleware/authMiddleware.js';
const upload = multer({
    Storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})

const router = Router();

router.post('/', auth, upload.single('file'), uploadFile);


export default router;