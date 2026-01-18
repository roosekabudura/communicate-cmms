import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed, onLogout }) => {
        
    // This line fetches the 'admin' or 'staff' label we saved at login
    const userRole = localStorage.getItem('role');
    
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Assets', path: '/assets', icon: '🧩' },
        { name: 'PM Schedules', path: '/pm', icon: '📅' },
        
        // Only show these if the user is an admin
    ...(userRole === 'admin' ? [
        { name: 'Work Orders', path: '/work-orders', icon: '🛠️' },
        { name: 'Inventory', path: '/inventory', icon: '📦' },
        { name: 'Reports', path: '/reports', icon: '📈' },
         { name: 'Engineers', path: '/engineers', icon: '👷' },
    ] : []),
       
    ];

    return (
        <div style={{
            ...s.sidebar,
            width: isCollapsed ? '80px' : '260px',
        }}>
            <div style={s.logoSection}>
                {!isCollapsed && <h2 style={s.logoText}>Communicate</h2>}
                <button onClick={() => setIsCollapsed(!isCollapsed)} style={s.toggleBtn}>
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>

            <nav style={s.nav}>
                {menuItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        // This class logic is what handles the "active" purple/blue highlight
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                        style={({ isActive }) => ({
                            ...s.navItem,
                            backgroundColor: isActive ? '#3b82f6' : 'transparent',
                            color: isActive ? 'white' : '#94a3b8',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            textDecoration: 'none' // Removes underline from links
                        })}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        {!isCollapsed && <span style={{ marginLeft: '15px' }}>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            <div style={s.footer}>
                <button onClick={onLogout} style={s.signOutBtn}>
                    <span>🚪</span> {!isCollapsed && <span style={{marginLeft: '10px'}}>Sign Out</span>}
                </button>
            </div>
        </div>
    );
};

const s = {
    sidebar: {
        height: '100vh',
        backgroundColor: '#0f172a',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        overflowX: 'hidden'
    },
    logoSection: { padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' },
    logoText: { margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' },
    toggleBtn: { background: '#1e293b', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer', padding: '5px 10px' },
    nav: { flex: 1, padding: '10px' },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px 15px', margin: '5px 0', borderRadius: '10px', transition: '0.2s', fontWeight: '500' },
    footer: { padding: '20px', borderTop: '1px solid #1e293b' },
    signOutBtn: { width: '100%', background: 'none', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px', fontWeight: 'bold' }
};


export default Sidebar;


