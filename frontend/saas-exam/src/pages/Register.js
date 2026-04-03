import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors, commonStyles } from '../theme';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await registerUser({ name, email, password, role: 'student' });
      if (data.token) {
        login(data, data.token);
        navigate('/student/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>P</div>
          <h1 style={styles.brandName}>PlacePrep Pro</h1>
          <p style={styles.brandTagline}>Engineering Placement Platform</p>
        </div>
        <div style={styles.features}>
          {['MCQ + Coding exams', 'Auto grading system', 'Timed result release', 'Rank & percentile'].map(f => (
            <div key={f} style={styles.featureItem}>
              <span style={styles.featureDot}></span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Join PlacePrep Pro today</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={commonStyles.label}>Full Name</label>
            <input
              style={commonStyles.input}
              type="text"
              placeholder="Rahul Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <label style={commonStyles.label}>Email</label>
            <input
              style={commonStyles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <label style={commonStyles.label}>Password</label>
            <input
              style={commonStyles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              style={{ ...commonStyles.button, opacity: loading ? 0.7 : 1 }}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p style={styles.loginLink}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: "'Segoe UI', sans-serif" },
  left: { flex: 1, background: '#161b27', borderRight: '1px solid #2d3748', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' },
  brand: { marginBottom: '48px' },
  logo: { width: '52px', height: '52px', borderRadius: '14px', background: colors.accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', marginBottom: '16px' },
  brandName: { color: '#e2e8f0', fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
  brandTagline: { color: '#64748b', fontSize: '15px' },
  features: { display: 'flex', flexDirection: 'column', gap: '14px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '15px' },
  featureDot: { width: '8px', height: '8px', borderRadius: '50%', background: colors.accent, flexShrink: 0 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  formBox: { width: '100%', maxWidth: '400px', background: '#161b27', border: '1px solid #2d3748', borderRadius: '16px', padding: '40px' },
  title: { color: '#e2e8f0', fontSize: '24px', fontWeight: '700', marginBottom: '6px' },
  subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '28px' },
  errorBox: { background: '#2d1515', border: '1px solid #f87171', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  loginLink: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' },
  link: { color: colors.accent, textDecoration: 'none', fontWeight: '500' },
};

export default Register;