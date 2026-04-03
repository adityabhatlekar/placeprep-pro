const Exam = require('../models/Exam');
const Result = require('../models/Result');

const flattenQuestions = (exam) => {
  const aptitudeQuestions = exam.sections?.aptitude?.questions || [];
  const technicalQuestions = exam.sections?.technical?.questions || [];
  return [...aptitudeQuestions, ...technicalQuestions];
};

// @route POST /api/exams/:examId/attempt/submit
// Student submits answers and gets auto-graded
const submitAttempt = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit attempts' });
    }

    const { answers = [] } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers must be an array' });
    }

    const exam = await Exam.findById(req.params.examId)
      .populate('sections.aptitude.questions')
      .populate('sections.technical.questions');

    if (!exam || !exam.isActive) {
      return res.status(404).json({ message: 'Active exam not found' });
    }

    const allQuestions = flattenQuestions(exam);
    const questionMap = new Map(allQuestions.map((q) => [String(q._id), q]));

    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    const evaluatedAnswers = [];

    for (const question of allQuestions) {
      totalMarks += question.marks || 1;
    }

    for (const answer of answers) {
      const question = questionMap.get(String(answer.questionId));
      if (!question || question.type !== 'mcq') {
        continue;
      }

      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      const marksAwarded = isCorrect ? question.marks || 1 : 0;

      if (isCorrect) {
        score += marksAwarded;
        correctCount += 1;
      } else {
        wrongCount += 1;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        marksAwarded
      });
    }

    const payload = {
      userId: req.user._id,
      examId: exam._id,
      answers: evaluatedAnswers,
      score,
      totalMarks,
      correctCount,
      wrongCount,
      submittedAt: new Date()
    };

    const result = await Result.findOneAndUpdate(
      { userId: req.user._id, examId: exam._id },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: 'Attempt submitted and graded successfully',
      result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAttempt };
