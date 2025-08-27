const express = require('express');
const router = express.Router();
const {
  getAllCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getAnalytics,
  getCandidatesByStatus
} = require('../controllers/candidateController');

// @route   GET /api/candidates
// @desc    Get all candidates with filtering, searching, and pagination
router.get('/', getAllCandidates);

// @route   GET /api/candidates/analytics/overview
// @desc    Get analytics data for dashboard
router.get('/analytics/overview', getAnalytics);

// @route   GET /api/candidates/status/:status
// @desc    Get candidates by specific status
router.get('/status/:status', getCandidatesByStatus);

// @route   GET /api/candidates/:id
// @desc    Get single candidate by ID
router.get('/:id', getCandidate);

// @route   POST /api/candidates
// @desc    Create new candidate
router.post('/', createCandidate);

// @route   PUT /api/candidates/:id
// @desc    Update candidate
router.put('/:id', updateCandidate);

// @route   PATCH /api/candidates/:id/status
// @desc    Update candidate status only
router.patch('/:id/status', updateCandidateStatus);

// @route   DELETE /api/candidates/:id
// @desc    Delete candidate
router.delete('/:id', deleteCandidate);

module.exports = router;
