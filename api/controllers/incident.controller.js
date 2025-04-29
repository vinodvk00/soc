import Incident from '../models/incident.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Create new incident
export const createIncident = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      severity, 
      category, 
      status, 
      assignedTo, 
      source, 
      tags,
      metadata 
    } = req.body;

    // Create new incident
    const newIncident = new Incident({
      title,
      description,
      severity: severity || 'Medium',
      category: category || 'Other',
      status: status || 'Open',
      reportedBy: req.user.id,
      assignedTo: assignedTo || null,
      source: source || 'Manual',
      tags: tags || [],
      metadata: metadata || {}
    });

    // Save incident
    await newIncident.save();

    // Populate user information
    const populatedIncident = await Incident.findById(newIncident._id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email');

    res.status(201).json(populatedIncident);
  } catch (error) {
    next(error);
  }
};

// Add this new function to get incident details with all metadata
export const getIncidentDetails = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email')
      .populate('comments.createdBy', 'username email');
    
    if (!incident) {
      return next(errorHandler(404, 'Incident not found'));
    }
    
    res.status(200).json(incident);
  } catch (error) {
    next(error);
  }
};

// Get user's incidents
export const getUserIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find({ reportedBy: req.user.id })
      .populate('reportedBy', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json(incidents);
  } catch (error) {
    next(error);
  }
};

// Get all incidents (admin only)
export const getAllIncidents = async (req, res, next) => {
  try {
    // Check if user is admin or has appropriate permissions
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not authorized to access all incidents'));
    }
    
    const { status, severity, category, timeframe } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (status && status !== 'All Statuses') filter.status = status;
    if (severity && severity !== 'All Severities') filter.severity = severity;
    if (category && category !== 'All Categories') filter.category = category;
    
    // Apply timeframe filter if provided
    if (timeframe) {
      const date = new Date();
      if (timeframe === 'today') {
        date.setHours(0, 0, 0, 0);
        filter.createdAt = { $gte: date };
      } else if (timeframe === 'week') {
        date.setDate(date.getDate() - 7);
        filter.createdAt = { $gte: date };
      } else if (timeframe === 'month') {
        date.setMonth(date.getMonth() - 1);
        filter.createdAt = { $gte: date };
      }
    }
    
    console.log('Incident filter:', filter); // Debug log
    
    // Get all incidents with detailed information
    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'username email profilePicture')
      .populate('assignedTo', 'username email profilePicture')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${incidents.length} incidents`); // Debug log
    
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Error in getAllIncidents:', error);
    next(error);
  }
};

// Get incident by ID
export const getIncidentById = async (req, res, next) => {
  try {
    console.log('Getting incident by ID:', req.params.id); // Debug log
    
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'username email profilePicture')
      .populate('assignedTo', 'username email profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'createdBy',
          select: 'username email profilePicture'
        }
      });
    
    if (!incident) {
      console.log('Incident not found'); // Debug log
      return next(errorHandler(404, 'Incident not found'));
    }
    
    // Check if user is admin or the reporter
    if (!req.user.isAdmin && incident.reportedBy._id.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not authorized to view this incident'));
    }
    
    res.status(200).json(incident);
  } catch (error) {
    console.error('Error in getIncidentById:', error);
    next(error);
  }
};

// Update incident
export const updateIncident = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can update incidents'));
    }
    
    const { status, severity, resolutionNotes } = req.body;
    
    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      {
        status,
        severity,
        resolutionNotes,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('reportedBy', 'username profilePicture');
    
    if (!updatedIncident) {
      return next(errorHandler(404, 'Incident not found'));
    }
    
    res.status(200).json(updatedIncident);
  } catch (error) {
    next(error);
  }
};

// Add comment to incident
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return next(errorHandler(400, 'Comment text is required'));
    }
    
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return next(errorHandler(404, 'Incident not found'));
    }
    
    // Check if user is admin or the reporter
    if (!req.user.isAdmin && incident.reportedBy.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not authorized to comment on this incident'));
    }
    
    const comment = {
      text,
      createdBy: req.user.id,
      createdAt: Date.now()
    };
    
    incident.comments.push(comment);
    await incident.save();
    
    // Populate the newly added comment
    const updatedIncident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'username profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'createdBy',
          select: 'username profilePicture'
        }
      });
    
    res.status(200).json(updatedIncident);
  } catch (error) {
    next(error);
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can access dashboard statistics'));
    }
    
    // Total incidents
    const totalIncidents = await Incident.countDocuments();
    
    // Recent incidents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentIncidents = await Incident.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Status counts
    const statusCounts = await Incident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Severity counts
    const severityCounts = await Incident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Incident.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    res.status(200).json({
      totalIncidents,
      recentIncidents,
      statusCounts,
      severityCounts,
      monthlyTrend
    });
  } catch (error) {
    next(error);
  }
};

// Generate incident report
export const generateReport = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'createdBy',
          select: 'username'
        }
      });
    
    if (!incident) {
      return next(errorHandler(404, 'Incident not found'));
    }
    
    // Check if user is admin or the reporter
    if (!req.user.isAdmin && incident.reportedBy._id.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not authorized to access this report'));
    }
    
    // Format the report data
    const report = {
      id: incident._id,
      title: incident.title,
      description: incident.description,
      status: incident.status,
      severity: incident.severity,
      reportedBy: incident.reportedBy.username,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      fileInfo: incident.fileInfo,
      scanResults: incident.scanResults,
      resolutionNotes: incident.resolutionNotes,
      comments: incident.comments.map(comment => ({
        text: comment.text,
        createdBy: comment.createdBy.username,
        createdAt: comment.createdAt
      }))
    };
    
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};