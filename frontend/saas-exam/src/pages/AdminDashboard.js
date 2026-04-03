import React, { useEffect, useState } from 'react';
import { getAllExams, createExam, addQuestion } from '../services/api';
import Sidebar from '../components/Sidebar';
import { colors, commonStyles } from '../theme';

function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [loading, setLoading] = useState(true);

  const [examForm, setExamForm] = useState({ title: '', description: '', duration: '', releaseAfter: 24 });
  const [questionForm, setQuestionForm] = useState({
    section: 'aptitude', type: 'mcq', questionText: '',
    options: ['', '', '', ''], correctAnswer: '', marks: 1,
    codingProblemDetails: { inputFormat: '', outputFormat: '', sampleInput: '', sampleOutput: '' }
  });

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    const data = await getAllExams();
    setExams(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    const data = await createExam(examForm);
    if (data.exam) {
      alert('Exam created!');
      setShowCreateExam(false);
      setExamForm({ title: '', description: '', duration: '', releaseAfter: 24 });
      fetchExams();
    } else alert(data.message || 'Failed');
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const payload = { ...questionForm };
    if (questionForm.type !== 'mcq') { payload.options = []; payload.correctAnswer = ''; }
    else delete payload.codingProblemDetails;
    const data = await addQuestion(selectedExamId, payload);
    if (data.question) {
      alert('Question added!');
      setQuestionForm({ section: 'aptitude', type: 'mcq', questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1, codingProblemDetails: { inputFormat: '', outputFormat: '', sampleInput: '', sampleOutput: '' } });
    } else alert(data.message || 'Failed');
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>Admin Dashboard</h1>
            <p style={styles.pageSub}>Manage exams and questions</p>
          </div>
          <button style={styles.createBtn} onClick={() => setShowCreateExam(!showCreateExam)}>
            {showCreateExam ? '✕ Cancel' : '+ Create Exam'}
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Exams</div>
              <div style={styles.statValue}>{exams.length}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Active Exams</div>
              <div style={styles.statValue}>{exams.filter(e => e.isActive).length}</div>
            </div>
          </div>

          {showCreateExam && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Create New Exam</h3>
              <form onSubmit={handleCreateExam}>
                <label style={commonStyles.label}>Exam Title</label>
                <input style={commonStyles.input} placeholder="e.g. TCS Mock Test 2025"
                  value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} required />
                <label style={commonStyles.label}>Description</label>
                <input style={commonStyles.input} placeholder="Short description"
                  value={examForm.description} onChange={e => setExamForm({ ...examForm, description: e.target.value })} />
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <label style={commonStyles.label}>Duration (mins)</label>
                    <input style={commonStyles.input} type="number" placeholder="90"
                      value={examForm.duration} onChange={e => setExamForm({ ...examForm, duration: e.target.value })} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={commonStyles.label}>Release After (hrs)</label>
                    <input style={commonStyles.input} type="number" placeholder="24"
                      value={examForm.releaseAfter} onChange={e => setExamForm({ ...examForm, releaseAfter: e.target.value })} />
                  </div>
                </div>
                <button style={commonStyles.button} type="submit">Create Exam</button>
              </form>
            </div>
          )}

          <div style={styles.sectionTitle}>All Exams</div>
          <div style={styles.examGrid}>
            {exams.map(exam => (
              <div key={exam._id} style={styles.examCard}>
                <div style={styles.examCardHeader}>
                  <h3 style={styles.examTitle}>{exam.title}</h3>
                  <span style={styles.activePill}>Active</span>
                </div>
                <p style={styles.examDesc}>{exam.description}</p>
                <div style={styles.examMeta}>
                  <span style={styles.metaPill}>{exam.duration} mins</span>
                  <span style={styles.metaPill}>Release: {exam.releaseAfter}hrs</span>
                </div>
                <button style={styles.addQBtn} onClick={() => { setSelectedExamId(exam._id); setShowAddQuestion(true); }}>
                  + Add Question
                </button>
              </div>
            ))}
          </div>

          {showAddQuestion && (
            <div style={styles.formCard}>
              <div style={styles.formHeader}>
                <h3 style={styles.formTitle}>Add Question</h3>
                <button style={styles.closeBtn} onClick={() => setShowAddQuestion(false)}>✕</button>
              </div>
              <form onSubmit={handleAddQuestion}>
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <label style={commonStyles.label}>Section</label>
                    <select style={commonStyles.input} value={questionForm.section}
                      onChange={e => setQuestionForm({ ...questionForm, section: e.target.value })}>
                      <option value="aptitude">Aptitude</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={commonStyles.label}>Type</label>
                    <select style={commonStyles.input} value={questionForm.type}
                      onChange={e => setQuestionForm({ ...questionForm, type: e.target.value })}>
                      <option value="mcq">MCQ</option>
                      <option value="coding">Coding</option>
                    </select>
                  </div>
                </div>
                <label style={commonStyles.label}>Question Text</label>
                <textarea style={{ ...commonStyles.input, resize: 'vertical' }}
                  placeholder="Enter the question..." rows={3}
                  value={questionForm.questionText}
                  onChange={e => setQuestionForm({ ...questionForm, questionText: e.target.value })} required />
                <label style={commonStyles.label}>Marks</label>
                <input style={commonStyles.input} type="number"
                  value={questionForm.marks}
                  onChange={e => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) })} />

                {questionForm.type === 'mcq' && (
                  <div>
                    <label style={commonStyles.label}>Options</label>
                    {questionForm.options.map((opt, i) => (
                      <input key={i} style={commonStyles.input} placeholder={`Option ${i + 1}`} value={opt}
                        onChange={e => {
                          const newOptions = [...questionForm.options];
                          newOptions[i] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }} />
                    ))}
                    <label style={commonStyles.label}>Correct Answer</label>
                    <input style={commonStyles.input} placeholder="Must match one option exactly"
                      value={questionForm.correctAnswer}
                      onChange={e => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })} />
                  </div>
                )}

                {questionForm.type === 'coding' && (
                  <div>
                    {[['inputFormat', 'Input Format'], ['outputFormat', 'Output Format'], ['sampleInput', 'Sample Input'], ['sampleOutput', 'Sample Output']].map(([key, label]) => (
                      <div key={key}>
                        <label style={commonStyles.label}>{label}</label>
                        <input style={commonStyles.input} placeholder={label}
                          value={questionForm.codingProblemDetails[key]}
                          onChange={e => setQuestionForm({ ...questionForm, codingProblemDetails: { ...questionForm.codingProblemDetails, [key]: e.target.value } })} />
                      </div>
                    ))}
                  </div>
                )}
                <button style={commonStyles.button} type="submit">Add Question</button>
              </form>
            </div>
          )}
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
  pageSub: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
  createBtn: { padding: '9px 20px', background: colors.accent, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  content: { padding: '24px 28px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  statCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '10px', padding: '18px' },
  statLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#e2e8f0' },
  sectionTitle: { fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' },
  examGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' },
  examCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  examCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  examTitle: { color: '#e2e8f0', fontSize: '15px', fontWeight: '600', margin: 0, flex: 1, marginRight: '8px' },
  activePill: { background: '#0f2a1a', color: colors.success, fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: `1px solid ${colors.success}`, flexShrink: 0 },
  examDesc: { color: '#64748b', fontSize: '13px', marginBottom: '12px' },
  examMeta: { display: 'flex', gap: '8px', marginBottom: '14px' },
  metaPill: { background: '#1e2a45', color: '#94a3b8', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' },
  addQBtn: { width: '100%', padding: '9px', background: 'transparent', color: colors.success, border: `1px solid ${colors.success}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  formCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  formTitle: { color: '#e2e8f0', fontSize: '16px', fontWeight: '600', margin: 0 },
  closeBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer' },
  row: { display: 'flex', gap: '12px' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#e2e8f0', background: '#0f1117', fontSize: '16px', fontFamily: "'Segoe UI', sans-serif" },
};

export default AdminDashboard;