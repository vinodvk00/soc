import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

// get working message for / route
router.get('/', (req, res) => {
    console.log('Auth route working fine');
  res.send('Auth route working');
});
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google)

export default router;