const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    releaseAfter: { type: Number, default: 24 },
    sections: {
        aptitude: { totalMarks: Number, questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] },
        technical: { totalMarks: Number, questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);