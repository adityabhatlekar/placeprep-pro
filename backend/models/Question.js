const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    section: { type: String, enum: ['aptitude', 'technical'], required: true },
    type: { type: String, enum: ['mcq', 'coding'], required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String },
    marks: { type: Number, default: 1 },
    codingProblemDetails: {
      inputFormat: String,
      outputFormat: String,
      sampleInput: String,
      sampleOutput: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
