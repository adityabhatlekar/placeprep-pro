const Submission = require('../models/Submission.js');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @route POST /api/submissions/:examId/submit
// Student submits exam answers
const submitExam = async (req, res) => {
  const { answers } = req.body;
  try {
    // Check if student already submitted this exam
    const alreadySubmitted = await Submission.findOne({
      examId: req.params.examId,
      studentId: req.user._id
    });
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'You have already submitted this exam' });
    }

    // Get exam with all questions
    const exam = await Exam.findById(req.params.examId)
      .populate('sections.aptitude.questions')
      .populate('sections.technical.questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Combine all questions
    const allQuestions = [
      ...exam.sections.aptitude.questions,
      ...exam.sections.technical.questions
    ];

    // Auto grade MCQ answers
    let aptitudeScore = 0;
    let technicalScore = 0;
    const gradedAnswers = answers.map(answer => {
      const question = allQuestions.find(
        q => q._id.toString() === answer.questionId
      );
      if (!question) return { ...answer, isCorrect: false };

      const isCorrect = question.type === 'mcq' &&
        question.correctAnswer === answer.selectedAnswer;

      if (isCorrect) {
        if (question.section === 'aptitude') aptitudeScore += question.marks;
        if (question.section === 'technical') technicalScore += question.marks;
      }

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    // Calculate total marks of exam
    const totalMarks = exam.sections.aptitude.totalMarks +
      exam.sections.technical.totalMarks;

    // Calculate release time
    const releasedAt = new Date(
      Date.now() + exam.releaseAfter * 60 * 60 * 1000
    );

    // Save submission
    const submission = await Submission.create({
      examId: req.params.examId,
      studentId: req.user._id,
      answers: gradedAnswers,
      aptitudeScore,
      technicalScore,
      totalScore: aptitudeScore + technicalScore,
      totalMarks,
      status: 'pending',
      submittedAt: new Date(),
      releasedAt
    });

    res.status(201).json({
      message: 'Exam submitted successfully! Results will be released after ' + exam.releaseAfter + ' hours.',
      submissionId: submission._id,
      submittedAt: submission.submittedAt,
      releasedAt: submission.releasedAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/submissions/my
// Student sees their own submissions
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('examId', 'title duration')
      .select('-answers');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/submissions/:examId/result
// Student sees result only if released
const getResult = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      examId: req.params.examId,
      studentId: req.user._id
    }).populate('examId', 'title duration releaseAfter');

    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this exam' });
    }

    if (submission.status === 'pending') {
      return res.status(403).json({
        message: 'Results not released yet',
        releasedAt: submission.releasedAt
      });
    }

    res.json({
      exam: submission.examId,
      aptitudeScore: submission.aptitudeScore,
      technicalScore: submission.technicalScore,
      totalScore: submission.totalScore,
      totalMarks: submission.totalMarks,
      rank: submission.rank,
      percentile: submission.percentile,
      submittedAt: submission.submittedAt,
      releasedAt: submission.releasedAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/submissions/:examId/leaderboard
// Get leaderboard for an exam (only after results released)
const getLeaderboard = async (req, res) => {
  try {
    const submissions = await Submission.find({
      examId: req.params.examId,
      status: 'released'
    })
      .populate('studentId', 'name email')
      .select('studentId totalScore aptitudeScore technicalScore rank')
      .sort({ totalScore: -1 });

    if (!submissions.length) {
      return res.status(404).json({ message: 'No results released yet' });
    }

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitExam, getMySubmissions, getResult, getLeaderboard };