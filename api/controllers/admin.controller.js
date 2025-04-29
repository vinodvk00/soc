import mongoose from 'mongoose';
import { errorHandler } from '../utils/error.js';

// Get all collection names in the database
export const getCollections = async (req, res, next) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    res.status(200).json(collectionNames);
  } catch (error) {
    next(error);
  }
};

// Get all documents from a specific collection
export const getDocumentsFromCollection = async (req, res, next) => {
  try {
    const { collectionName } = req.params;
    
    // Security check - prevent access to sensitive collections
    const restrictedCollections = ['sessions']; // Add any collections you want to restrict
    if (restrictedCollections.includes(collectionName)) {
      return next(errorHandler(403, 'Access to this collection is restricted'));
    }
    
    const documents = await mongoose.connection.db
      .collection(collectionName)
      .find({})
      .limit(100) // Limit to prevent overwhelming responses
      .toArray();
    
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};