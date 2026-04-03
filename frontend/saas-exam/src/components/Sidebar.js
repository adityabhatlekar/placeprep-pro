import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: '▦' },
    { label: 'My Results', path: '/student/results', icon: '📊' },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '▦' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={styles.logoBox}>P</div>
        <div>
          <div style={styles.logoText}>PlacePrep Pro</div>
          <div style={styles.logoSub}>Engineering Placement</div>
        </div>
      </div>

      <div style={styles.nav}>
        <div style={styles.navSection}>
          {user?.role === 'admin' ? 'Admin' : 'Student'}
        </div>
        {links.map(link => (
          <div
            key={link.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === link.path ? styles.navItemActive : {})
            }}
            onClick={() => navigate(link.path)}
          >
            <span style={styles.navIcon}>{link.icon}</span>
            {link.label}
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.userBadge}>
          <div style={styles.avatar}>{initials}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: { width: '220px', minHeight: '100vh', background: '#161b27', borderRight: '1px solid #2d3748', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif", flexShrink: 0 },
  logoSection: { padding: '20px 16px', borderBottom: '1px solid #2d3748', display: 'flex', alignItems: 'center', gap: '10px' },
  logoBox: { width: '36px', height: '36px', borderRadius: '8px', background: colors.accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', flexShrink: 0 },
  logoText: { color: '#e2e8f0', fontSize: '14px', fontWeight: '700' },
  logoSub: { color: '#64748b', fontSize: '11px' },
  nav: { flex: 1, padding: '12px 8px' },
  navSection: { fontSize: '10px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 12px 6px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8', fontSize: '13px', marginBottom: '2px', transition: 'all 0.2s' },
  navItemActive: { background: '#1e2a45', color: colors.accent, fontWeight: '600' },
  navIcon: { fontSize: '14px', width: '18px', textAlign: 'center' },
  footer: { padding: '12px', borderTop: '1px solid #2d3748' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#1a2235', borderRadius: '8px', marginBottom: '8px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: colors.accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  userInfo: { overflow: 'hidden' },
  userName: { color: '#e2e8f0', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { color: '#64748b', fontSize: '11px', textTransform: 'capitalize' },
  logoutBtn: { width: '100%', padding: '8px', background: 'transparent', border: '1px solid #2d3748', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' },
};

export default Sidebar;