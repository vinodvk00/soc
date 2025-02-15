import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletescheme, getschemes, updatescheme } from '../controllers/scheme.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getschemes', getschemes)
router.delete('/deletescheme/:schemeId/:userId', verifyToken, deletescheme)
router.put('/updatescheme/:schemeId/:userId', verifyToken, updatescheme)


export default router;