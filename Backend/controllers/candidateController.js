const Candidate = require('../models/Candidate');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
const getAllCandidates = async (req, res) => {
  try {
    const { 
      status, 
      search, 
      sortBy = 'appliedDate', 
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const candidates = await Candidate.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Candidate.countDocuments(query);

    res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidates',
      message: error.message
    });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Public
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidate',
      message: error.message
    });
  }
};

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Public
const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    
    res.status(201).json({
      success: true,
      data: candidate,
      message: 'Candidate created successfully'
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create candidate',
      message: error.message
    });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Public
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate,
      message: 'Candidate updated successfully'
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update candidate',
      message: error.message
    });
  }
};

// @desc    Update candidate status
// @route   PATCH /api/candidates/:id/status
// @access  Public
const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['applied', 'interview', 'offer', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: applied, interview, offer, rejected'
      });
    }

    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    candidate.status = status;
    await candidate.save();

    res.status(200).json({
      success: true,
      data: candidate,
      message: `Candidate status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update candidate status',
      message: error.message
    });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Public
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete candidate',
      message: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/candidates/analytics/overview
// @access  Public
const getAnalytics = async (req, res) => {
  try {
    // Get status distribution
    const statusAnalytics = await Candidate.getAnalytics();
    
    // Get total count
    const totalCandidates = await Candidate.countDocuments();
    
    // Get average experience
    const avgExperienceResult = await Candidate.aggregate([
      {
        $group: {
          _id: null,
          avgExperience: { $avg: '$experience' }
        }
      }
    ]);
    
    const avgExperience = avgExperienceResult.length > 0 
      ? Math.round(avgExperienceResult[0].avgExperience * 10) / 10 
      : 0;

    // Get role distribution
    const roleAnalytics = await Candidate.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await Candidate.countDocuments({
      appliedDate: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalCandidates,
        avgExperience,
        recentActivity,
        statusDistribution: statusAnalytics,
        roleDistribution: roleAnalytics
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
};

// @desc    Get candidates by status
// @route   GET /api/candidates/status/:status
// @access  Public
const getCandidatesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!['applied', 'interview', 'offer', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: applied, interview, offer, rejected'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const candidates = await Candidate.find({ status })
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Candidate.countDocuments({ status });

    res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching candidates by status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidates by status',
      message: error.message
    });
  }
};

module.exports = {
  getAllCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getAnalytics,
  getCandidatesByStatus
};
