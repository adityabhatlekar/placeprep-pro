import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResult } from '../services/api';
import Sidebar from '../components/Sidebar';
import { colors } from '../theme';

function Scorecard() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const data = await getResult(examId);
      if (data.message === 'Results not released yet') {
        setPending(true);
      }
      setResult(data);
      setLoading(false);
    };
    fetchResult();
  }, [examId]);

  if (loading) return <div style={styles.loading}>Loading result...</div>;

  if (pending) return (
    <div style={styles.page}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.centered}>
          <div style={styles.lockCard}>
            <div style={styles.lockIcon}>🔒</div>
            <h2 style={styles.lockTitle}>Results Not Released Yet</h2>
            <p style={styles.lockSub}>Your result will be available on</p>
            <div style={styles.releaseDate}>
              {new Date(result.releasedAt).toLocaleString()}
            </div>
            <button style={styles.backBtn} onClick={() => navigate('/student/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const percentage = Math.round((result.totalScore / result.totalMarks) * 100);
  const percentageColor = percentage >= 75 ? colors.success : percentage >= 50 ? colors.warning : colors.danger;

  return (
    <div style={styles.page}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h1 style={styles.pageTitle}>Scorecard</h1>
          <button style={styles.backBtn2} onClick={() => navigate('/student/dashboard')}>
            Back to Dashboard
          </button>
        </div>
        <div style={styles.content}>
          <div style={styles.scorecardGrid}>
            <div style={styles.leftPanel}>
              <div style={styles.scoreCard}>
                <div style={styles.examNameLabel}>{result.exam?.title}</div>
                <div style={{ ...styles.scoreCircle, borderColor: percentageColor }}>
                  <div style={{ ...styles.scoreNum, color: percentageColor }}>{result.totalScore}</div>
                  <div style={styles.scoreTotal}>out of {result.totalMarks}</div>
                </div>
                <div style={{ ...styles.percentageBig, color: percentageColor }}>{percentage}%</div>
                <div style={styles.percentLabel}>Overall Score</div>
              </div>

              <div style={styles.datesCard}>
                <div style={styles.dateRow}>
                  <span style={styles.dateLabel}>Submitted</span>
                  <span style={styles.dateValue}>{new Date(result.submittedAt).toLocaleString()}</span>
                </div>
                <div style={styles.dateRow}>
                  <span style={styles.dateLabel}>Released</span>
                  <span style={styles.dateValue}>{new Date(result.releasedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={styles.rightPanel}>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Aptitude Score</div>
                  <div style={styles.statValue}>{result.aptitudeScore}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Technical Score</div>
                  <div style={styles.statValue}>{result.technicalScore}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Rank</div>
                  <div style={{ ...styles.statValue, color: colors.accent }}>#{result.rank}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Percentile</div>
                  <div style={{ ...styles.statValue, color: colors.success }}>{result.percentile}%</div>
                </div>
              </div>

              <div style={styles.sectionBreakdown}>
                <div style={styles.breakdownTitle}>Section Breakdown</div>
                <div style={styles.breakdownItem}>
                  <div style={styles.breakdownLabel}>Aptitude</div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${Math.round((result.aptitudeScore / (result.totalMarks / 2)) * 100)}%`, background: colors.accent }} />
                  </div>
                  <div style={styles.breakdownScore}>{result.aptitudeScore}</div>
                </div>
                <div style={styles.breakdownItem}>
                  <div style={styles.breakdownLabel}>Technical</div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${Math.round((result.technicalScore / (result.totalMarks / 2)) * 100)}%`, background: colors.warning }} />
                  </div>
                  <div style={styles.breakdownScore}>{result.technicalScore}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#0f1117', fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: { padding: '20px 28px', borderBottom: '1px solid #2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { color: '#e2e8f0', fontSize: '20px', fontWeight: '700', margin: 0 },
  content: { padding: '24px 28px' },
  scorecardGrid: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' },
  leftPanel: { display: 'flex', flexDirection: 'column', gap: '16px' },
  scoreCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '12px', padding: '28px', textAlign: 'center' },
  examNameLabel: { color: '#94a3b8', fontSize: '13px', marginBottom: '20px' },
  scoreCircle: { width: '120px', height: '120px', borderRadius: '50%', border: '4px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  scoreNum: { fontSize: '32px', fontWeight: '800', lineHeight: 1 },
  scoreTotal: { color: '#64748b', fontSize: '12px', marginTop: '4px' },
  percentageBig: { fontSize: '28px', fontWeight: '700', marginBottom: '4px' },
  percentLabel: { color: '#64748b', fontSize: '12px' },
  datesCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '12px', padding: '16px' },
  dateRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  dateLabel: { color: '#64748b', fontSize: '12px' },
  dateValue: { color: '#94a3b8', fontSize: '12px' },
  rightPanel: { display: 'flex', flexDirection: 'column', gap: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  statCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  statLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#e2e8f0' },
  sectionBreakdown: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  breakdownTitle: { color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' },
  breakdownItem: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  breakdownLabel: { color: '#94a3b8', fontSize: '13px', width: '80px', flexShrink: 0 },
  progressBar: { flex: 1, height: '8px', background: '#1e2a45', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.6s ease' },
  breakdownScore: { color: '#e2e8f0', fontSize: '13px', fontWeight: '600', width: '24px', textAlign: 'right' },
  centered: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  lockCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '400px' },
  lockIcon: { fontSize: '48px', marginBottom: '16px' },
  lockTitle: { color: '#e2e8f0', fontSize: '20px', fontWeight: '700', marginBottom: '8px' },
  lockSub: { color: '#64748b', fontSize: '14px', marginBottom: '12px' },
  releaseDate: { color: colors.accent, fontSize: '16px', fontWeight: '600', marginBottom: '24px' },
  backBtn: { padding: '10px 24px', background: colors.accent, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  backBtn2: { padding: '8px 18px', background: 'transparent', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#e2e8f0', background: '#0f1117', fontSize: '16px', fontFamily: "'Segoe UI', sans-serif" },
};

export default Scorecard;