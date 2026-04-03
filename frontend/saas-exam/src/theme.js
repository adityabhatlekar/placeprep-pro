export const colors = {
  bg: '#0f1117',
  sidebar: '#161b27',
  card: '#161b27',
  border: '#2d3748',
  accent: '#7c6af7',
  accentHover: '#6d5ce7',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textSecondary: '#94a3b8',
  success: '#4ade80',
  warning: '#f59e0b',
  danger: '#f87171',
  inputBg: '#1a2235',
};

export const sidebar = {
  width: '220px',
  background: colors.sidebar,
  borderRight: `1px solid ${colors.border}`,
};

export const commonStyles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: colors.bg,
    color: colors.text,
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: '10px',
    padding: '20px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: '#1a2235',
    border: `1px solid #2d3748`,
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    marginBottom: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '11px',
    background: '#7c6af7',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  label: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '6px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }
};