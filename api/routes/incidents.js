import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
  createIncident, 
  getUserIncidents, 
  getAllIncidents, 
  getIncidentById,
  updateIncident,
  addComment,
  getDashboardStats,
  generateReport
} from '../controllers/incident.controller.js';

const router = express.Router();

// Create new incident
router.post('/create', verifyToken, createIncident);

// Get user's incidents
router.get('/user', verifyToken, getUserIncidents);

// Get all incidents (admin only)
router.get('/all', verifyToken, getAllIncidents);

// Get incident by ID
router.get('/:id', verifyToken, getIncidentById);

// Update incident
router.put('/update/:id', verifyToken, updateIncident);

// Add comment to incident
router.post('/comment/:id', verifyToken, addComment);

// Get dashboard statistics
router.get('/stats/dashboard', verifyToken, getDashboardStats);

// Generate incident report
router.get('/report/:id', verifyToken, generateReport);

export default router;