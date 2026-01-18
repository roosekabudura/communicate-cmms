import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Sidebar from '../components/Sidebar'; 
import './layout.css';

const MainLayout = () => {
    const navigate = useNavigate();
    // 1. Create the state for collapsing here so both Sidebar and Main can use it
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* 2. Pass the toggle state and logout function to the Sidebar component */}
            <Sidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                onLogout={handleLogout} 
            />

            {/* 3. The main area now moves dynamically based on isCollapsed */}
            <main className="main-content" style={{
                flex: 1,
                marginLeft: isCollapsed ? '80px' : '260px', // Dynamic margin
                transition: 'margin-left 0.3s ease-in-out', // Smooth movement
                backgroundColor: '#f8fafc',
                minHeight: '100vh'
            }}>
              <div style={{ padding: '30px' }}>
                    {/* BREADCRUMBS APPEAR HERE */}
                    <Breadcrumbs />
                <div className="content-wrapper" style={{ padding: '30px' }}>
                    <Outlet />
                </div>
                </div>
            </main>
        </div>
    );
};

import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav style={bStyle.nav}>
            <Link to="/dashboard" style={bStyle.link}>Home</Link>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                return (
                    <span key={to} style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={bStyle.separator}> / </span>
                        {last ? (
                            <span style={bStyle.current}>
                                {value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}
                            </span>
                        ) : (
                            <Link to={to} style={bStyle.link}>
                                {value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

const bStyle = {
    nav: { display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '0.9rem' },
    link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '500' },
    separator: { margin: '0 10px', color: '#94a3b8' },
    current: { color: '#64748b', fontWeight: '600' }
};
export default MainLayout;