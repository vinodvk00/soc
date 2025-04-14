import express from 'express';
import { 
  createIncident, 
  getAllIncidents, 
  getUserIncidents, 
  getIncidentById,
  getIncidentDetails,
  updateIncident, 
  deleteIncident,
  addComment,
  assignIncident
} from '../controllers/incident.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create new incident
router.post('/create', verifyToken, createIncident);

// Get all incidents (admin only)
router.get('/all', verifyToken, getAllIncidents);

// Get user's incidents
router.get('/user', verifyToken, getUserIncidents);

// Get incident by ID
router.get('/:id', verifyToken, getIncidentById);

// Get detailed incident information
router.get('/:id/details', verifyToken, getIncidentDetails);

// Update incident
router.put('/:id', verifyToken, updateIncident);

// Delete incident
router.delete('/:id', verifyToken, deleteIncident);

// Add comment to incident
router.post('/:id/comment', verifyToken, addComment);

// Assign incident to user
router.put('/:id/assign', verifyToken, assignIncident);

export default router;