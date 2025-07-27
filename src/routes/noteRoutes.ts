import express from 'express';
import { createNote, deleteNote, getNotes } from '../controllers/noteController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);
router.post('/', createNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

export default router;