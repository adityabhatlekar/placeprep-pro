const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedAnswer: { type: String },
      isCorrect: { type: Boolean, default: false }
    }
  ],
  aptitudeScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'released'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  releasedAt: { type: Date },
  rank: { type: Number },
  percentile: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);