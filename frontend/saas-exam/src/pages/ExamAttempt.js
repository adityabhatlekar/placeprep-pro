import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, submitExam } from '../services/api';
import { colors } from '../theme';

function ExamAttempt() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('aptitude');

  useEffect(() => {
    const fetchExam = async () => {
      const data = await getExamById(examId);
      setExam(data);
      setTimeLeft(data.duration * 60);
      setLoading(false);
    };
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer }));
    const data = await submitExam(examId, { answers: formattedAnswers });
    if (data.submissionId) {
      alert(data.message);
      navigate('/student/dashboard');
    } else {
      alert(data.message || 'Submission failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading exam...</div>;

  const aptitudeQuestions = exam?.sections?.aptitude?.questions || [];
  const technicalQuestions = exam?.sections?.technical?.questions || [];
  const currentQuestions = activeSection === 'aptitude' ? aptitudeQuestions : technicalQuestions;
  const answered = Object.keys(answers).length;
  const total = aptitudeQuestions.length + technicalQuestions.length;
  const isLow = timeLeft < 300;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBox}>P</div>
          <div>
            <div style={styles.examName}>{exam?.title}</div>
            <div style={styles.examSub}>{answered}/{total} answered</div>
          </div>
        </div>
        <div style={{ ...styles.timer, background: isLow ? '#2d1515' : '#1e2a45', color: isLow ? '#f87171' : colors.accent, border: `1px solid ${isLow ? '#f87171' : colors.accent}` }}>
          {formatTime(timeLeft)}
        </div>
        <button style={styles.submitHeaderBtn} onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Exam'}
        </button>
      </div>

      <div style={styles.body}>
        <div style={styles.sectionTabs}>
          {['aptitude', 'technical'].map(section => (
            <button
              key={section}
              style={{ ...styles.tab, ...(activeSection === section ? styles.tabActive : {}) }}
              onClick={() => setActiveSection(section)}
            >
              {section === 'aptitude' ? 'Section 1 — Aptitude' : 'Section 2 — Technical'}
              <span style={styles.tabCount}>
                {section === 'aptitude' ? aptitudeQuestions.length : technicalQuestions.length} Qs
              </span>
            </button>
          ))}
        </div>

        <div style={styles.questions}>
          {currentQuestions.map((q, index) => (
            <div key={q._id} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <span style={styles.qNumber}>Q{index + 1}</span>
                <span style={styles.qMarks}>{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                <span style={{ ...styles.qType, background: q.type === 'coding' ? '#2a1f0f' : '#1a2235', color: q.type === 'coding' ? colors.warning : colors.accent }}>
                  {q.type.toUpperCase()}
                </span>
              </div>
              <p style={styles.questionText}>{q.questionText}</p>

              {q.type === 'mcq' && (
                <div style={styles.options}>
                  {q.options.map((opt, i) => (
                    <label key={i} style={{ ...styles.option, ...(answers[q._id] === opt ? styles.optionSelected : {}) }}>
                      <input type="radio" name={q._id} value={opt}
                        onChange={() => handleAnswer(q._id, opt)}
                        checked={answers[q._id] === opt}
                        style={{ display: 'none' }}
                      />
                      <span style={{ ...styles.optionDot, background: answers[q._id] === opt ? colors.accent : 'transparent', border: `2px solid ${answers[q._id] === opt ? colors.accent : '#2d3748'}` }}></span>
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'coding' && (
                <div>
                  <div style={styles.codingInfo}>
                    <div style={styles.codingRow}><span style={styles.codingLabel}>Input:</span> {q.codingProblemDetails?.inputFormat}</div>
                    <div style={styles.codingRow}><span style={styles.codingLabel}>Output:</span> {q.codingProblemDetails?.outputFormat}</div>
                    <div style={styles.codingRow}><span style={styles.codingLabel}>Sample Input:</span> {q.codingProblemDetails?.sampleInput}</div>
                    <div style={styles.codingRow}><span style={styles.codingLabel}>Sample Output:</span> {q.codingProblemDetails?.sampleOutput}</div>
                  </div>
                  <textarea
                    style={styles.codeArea}
                    placeholder="// Write your code here..."
                    onChange={e => handleAnswer(q._id, e.target.value)}
                    value={answers[q._id] || ''}
                    rows={10}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f1117', fontFamily: "'Segoe UI', sans-serif", color: '#e2e8f0' },
  header: { background: '#161b27', borderBottom: '1px solid #2d3748', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoBox: { width: '36px', height: '36px', borderRadius: '8px', background: colors.accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800' },
  examName: { color: '#e2e8f0', fontSize: '15px', fontWeight: '600' },
  examSub: { color: '#64748b', fontSize: '12px', marginTop: '2px' },
  timer: { padding: '8px 18px', borderRadius: '8px', fontSize: '20px', fontWeight: '700', letterSpacing: '1px' },
  submitHeaderBtn: { padding: '9px 20px', background: colors.accent, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  body: { maxWidth: '860px', margin: '0 auto', padding: '24px 20px' },
  sectionTabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
  tab: { flex: 1, padding: '12px 16px', background: '#161b27', border: '1px solid #2d3748', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tabActive: { background: '#1e2a45', borderColor: colors.accent, color: colors.accent },
  tabCount: { background: '#2d3748', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' },
  questions: { display: 'flex', flexDirection: 'column', gap: '16px' },
  questionCard: { background: '#161b27', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  questionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  qNumber: { background: colors.accent, color: 'white', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  qMarks: { color: '#64748b', fontSize: '12px', marginLeft: 'auto' },
  qType: { fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: '600', letterSpacing: '0.5px' },
  questionText: { color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' },
  options: { display: 'flex', flexDirection: 'column', gap: '8px' },
  option: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #2d3748', cursor: 'pointer', fontSize: '14px', color: '#94a3b8', transition: 'all 0.2s' },
  optionSelected: { borderColor: colors.accent, color: '#e2e8f0', background: '#1e2a45' },
  optionDot: { width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, transition: 'all 0.2s' },
  codingInfo: { background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px', padding: '14px', marginBottom: '12px' },
  codingRow: { fontSize: '13px', color: '#94a3b8', marginBottom: '6px' },
  codingLabel: { color: '#64748b', marginRight: '8px' },
  codeArea: { width: '100%', padding: '14px', background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#e2e8f0', background: '#0f1117', fontSize: '16px', fontFamily: "'Segoe UI', sans-serif" },
};

export default ExamAttempt;