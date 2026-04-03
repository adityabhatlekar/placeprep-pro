const cron = require('node-cron');
const Submission = require('../models/Submission');

const releaseResults = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find all pending submissions whose release time has passed
      const submissions = await Submission.find({
        status: 'pending',
        releasedAt: { $lte: now }
      });

      for (const submission of submissions) {
        // Calculate rank among all students for this exam
        const allSubmissions = await Submission.find({
          examId: submission.examId,
          status: 'released'
        }).sort({ totalScore: -1 });

        const rank = allSubmissions.length + 1;
        const totalStudents = allSubmissions.length + 1;
        const percentile = ((totalStudents - rank) / totalStudents) * 100;

        submission.status = 'released';
        submission.rank = rank;
        submission.percentile = Math.round(percentile);
        await submission.save();

        console.log(`Result released for submission: ${submission._id}`);
      }
    } catch (error) {
      console.error('Cron job error:', error.message);
    }
  });
  console.log('Result release cron job started');
};

module.exports = releaseResults;