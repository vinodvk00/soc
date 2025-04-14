import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  archiveUser, // Add this import
} from '../controllers/user.controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', verifyAdmin, test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyAdmin, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyAdmin, getUsers);
router.get('/:userId', verifyAdmin, getUser);
router.put('/archive/:userId', verifyAdmin, archiveUser);

export default router;