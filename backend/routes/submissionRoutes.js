const express = require('express');
const router = express.Router();
const { submitExam, getMySubmissions, getResult, getLeaderboard } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:examId/submit', protect, submitExam);
router.get('/my', protect, getMySubmissions);
router.get('/:examId/result', protect, getResult);
router.get('/:examId/leaderboard', protect, getLeaderboard);

module.exports = router;