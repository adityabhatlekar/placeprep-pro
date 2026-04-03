import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExams, getMySubmissions } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { colors } from '../theme';

function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const examsData = await getAllExams();
      const subsData = await getMySubmissions();
      setExams(Array.isArray(examsData) ? examsData : []);
      setSubmissions(Array.isArray(subsData) ? subsData : []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const isAttempted = (examId) => submissions.some(s => s.examId._id === examId);
  const getSubmission = (examId) => submissions.find(s => s.examId._id === examId);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  const attempted = submissions.length;
  const pending = submissions.filter(s => s.status === 'pending').length;
  const bestScore = submissions.length > 0
    ? Math.max(...submissions.filter(s => s.status === 'released').map(s => Math.round((s.totalScore / s.totalMarks) * 100) || 0))
    : 0;

  return (
    <div style={styles.page}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>Welcome back, {user?.name}</p>
          </div>
          <div style={styles.badge}>{exams.length} Exams Available</div>
        </div>

        <div style={styles.content}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Exams Attempted</div>
              <div style={styles.statValue}>{attempted}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Best Score</div>
              <div style={styles.statValue}>{bestScore > 0 ? `${bestScore}%` : 'N/A'}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Results Pending</div>
              <div style={{ ...styles.statValue, color: pending > 0 ? colors.warning : colors.success }}>
                {pending}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Exams Left</div>
              <div style={styles.statValue}>{exams.length - attempted}</div>
            </div>
          </div>

          <div style={styles.sectionTitle}>Available Exams</div>
          {exams.length === 0 && <p style={{ color: '#64748b' }}>No exams available right now.</p>}
          <div style={styles.examGrid}>
            {exams.map(exam => {
              const attempted = isAttempted(exam._id);
              const submission = getSubmission(exam._id);
              return (
                <div key={exam._id} style={styles.examCard}>
                  <div style={styles.examCardTop}>
                    <h3 style={styles.examTitle}>{exam.title}</h3>
                    {attempted && (
                      <span style={{
                        ...styles.statusPill,
                        background: submission?.status === 'released' ? '#0f2a1a' : '#2a1f0f',
                        color: submission?.status === 'released' ? colors.success : colors.warning,
                        border: `1px solid ${submission?.status === 'released' ? colors.success : colors.warning}`,
                      }}>
                        {submission?.status === 'released' ? 'Released' : 'Pending'}
                      </span>
                    )}
                  </div>
                  <p style={styles.examDesc}>{exam.description}</p>
                  <div style={styles.examMeta}>
                    <span style={styles.metaPill}>{exam.duration} mins</span>
                    <span style={styles.metaPill}>Results in {exam.releaseAfter}hrs</span>
                  </div>
                  {!attempted ? (
                    <button style={styles.attemptBtn} onClick={() => navigate(`/student/exam/${exam._id}`)}>
                      Attempt Exam
                    </button>
                  ) : (
                    <button style={styles.resultBtn} onClick={() => navigate(`/student/result/${exam._id}`)}>
                      View Result
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#0f1117', fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { padding: '20px 28px', borderBottom: '1px solid #2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f1117' },
  pageTitle: { color: '#e2e8f0', fontSize: '20px', fontWeight: '700', margin: 0 },
  pageSubtitle: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
  badge: { background: '#1e2a45', color: colors.accent, fontSize: '12px', padding: '6px 14px', borderRadius: '20px', border: '1px solid #2d3748' },
  content: { padding: '24px 28px', overflowY: 'auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' },
  statCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '10px', padding: '18px' },
  statLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#e2e8f0' },
  sectionTitle: { fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' },
  examGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  examCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  examCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' },
  examTitle: { color: '#e2e8f0', fontSize: '15px', fontWeight: '600', margin: 0, flex: 1, marginRight: '8px' },
  statusPill: { fontSize: '11px', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0 },
  examDesc: { color: '#64748b', fontSize: '13px', marginBottom: '14px', marginTop: '6px' },
  examMeta: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  metaPill: { background: '#1e2a45', color: '#94a3b8', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' },
  attemptBtn: { width: '100%', padding: '10px', background: colors.accent, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  resultBtn: { width: '100%', padding: '10px', background: 'transparent', color: colors.success, border: `1px solid ${colors.success}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#e2e8f0', background: '#0f1117', fontFamily: "'Segoe UI', sans-serif" },
};

export default StudentDashboard;