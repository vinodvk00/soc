import express from 'express';
import { getCollections, getDocumentsFromCollection } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../utils/verifyUser.js';

const router = express.Router();

// Get all collections
router.get('/collections', verifyAdmin, getCollections);

// Get documents from a specific collection
router.get('/collections/:collectionName', verifyAdmin, getDocumentsFromCollection);

export default router;