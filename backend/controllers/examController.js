const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @route POST /api/exams/create
// Admin creates a new exam
const createExam = async (req, res) => {
  const { title, description, duration, releaseAfter } = req.body;
  try {
    const exam = await Exam.create({
      title,
      description,
      duration,
      releaseAfter: releaseAfter || 24,
      sections: {
        aptitude: { totalMarks: 0, questions: [] },
        technical: { totalMarks: 0, questions: [] }
      },
      createdBy: req.user._id
    });
    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/exams/:examId/questions
// Admin adds a question to an exam
const addQuestion = async (req, res) => {
  const { section, type, questionText, options, correctAnswer, marks, codingProblemDetails } = req.body;
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const question = await Question.create({
      examId: req.params.examId,
      section,
      type,
      questionText,
      options,
      correctAnswer,
      marks: marks || 1,
      codingProblemDetails
    });

    exam.sections[section].questions.push(question._id);
    exam.sections[section].totalMarks += marks || 1;
    await exam.save();

    res.status(201).json({ message: 'Question added successfully', question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/exams
// Get all active exams (students see this)
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .select('-sections.aptitude.questions -sections.technical.questions')
      .populate('createdBy', 'name');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/exams/:examId
// Get single exam with all questions (for attempt)
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId)
      .populate('sections.aptitude.questions')
      .populate('sections.technical.questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Remove correct answers before sending to student
    const sanitizedExam = JSON.parse(JSON.stringify(exam));
    if (req.user.role === 'student') {
      sanitizedExam.sections.aptitude.questions.forEach(q => delete q.correctAnswer);
      sanitizedExam.sections.technical.questions.forEach(q => delete q.correctAnswer);
    }
    res.json(sanitizedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createExam, addQuestion, getAllExams, getExamById };