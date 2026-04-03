const express = require('express');
const router = express.Router();
const { createExam, addQuestion, getAllExams, getExamById } = require('../controllers/examController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin routes
router.post('/create', protect, adminOnly, createExam);
router.post('/:examId/questions', protect, adminOnly, addQuestion);

// Student + Admin routes
router.get('/', protect, getAllExams);
router.get('/:examId', protect, getExamById);

module.exports = router;