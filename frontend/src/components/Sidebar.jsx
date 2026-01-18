import React from 'react';
import { Link } from 'react-router-dom'; // We removed useLocation here

const Sidebar = ({ isCollapsed, setIsCollapsed, onLogout }) => {
    
    // We get the role from memory
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
            width: isCollapsed ? '80px' : '260px', 
            background: '#0f172a', 
            height: '100vh', 
            color: 'white', 
            transition: 'all 0.3s',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #1e293b' }}>
                {!isCollapsed && <h2 style={{ margin: 0, fontSize: '1.2rem' }}>COMMUNICATE</h2>}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginTop: '10px' }}
                >
                    {isCollapsed ? '➡' : '⬅'}
                </button>
            </div>

            <nav style={{ marginTop: '20px' }}>
                {menuItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px 25px',
                            color: 'white', // We simplified this to just white
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        <span style={{ marginRight: '15px' }}>{item.icon}</span>
                        {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            <button 
                onClick={onLogout}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '10px',
                    fontWeight: 'bold'
                }}
            >
                {isCollapsed ? '🚪' : 'Logout Exit'}
            </button>
        </div>
    );
};

export default Sidebar;
