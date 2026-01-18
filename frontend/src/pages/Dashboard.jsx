import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState({ assets: 0, workOrders: 0, engineers: 0, lowStock: 0 });

    useEffect(() => {
        // Fetch counts from backend
        const fetchData = async () => {
            const [a, w, e, i] = await Promise.all([
                fetch('http://127.0.0.1:8000/assets').then(r => r.json()),
                fetch('http://127.0.0.1:8000/work-orders').then(r => r.json()),
                fetch('http://127.0.0.1:8000/engineers').then(r => r.json()),
                fetch('http://127.0.0.1:8000/inventory').then(r => r.json()),
            ]);
            setStats({
                assets: a.length,
                workOrders: w.length,
                engineers: e.length,
                lowStock: i.filter(item => item.quantity < 5).length
            });
        };
        fetchData();
    }, []);

    return (
        <div style={{ marginLeft: '260px', padding: '50px', background: '#f8fafc', minHeight: '100vh' }}>
            <h1 style={{marginBottom: '40px', fontWeight: '800'}}>Operations Command Center</h1>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px'}}>
                <StatCard title="Total Assets" value={stats.assets} color="#3b82f6" />
                <StatCard title="Active Work Orders" value={stats.workOrders} color="#8b5cf6" />
                <StatCard title="Field Engineers" value={stats.engineers} color="#10b981" />
                <StatCard title="Stock Alerts" value={stats.lowStock} color="#ef4444" />
            </div>

            <div style={{marginTop: '40px', background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0'}}>
                <h3>Recent System Activity</h3>
                <p style={{color: '#64748b'}}>All systems operational. No critical NMS alarms detected in the last 15 minutes.</p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', borderLeft: `6px solid ${color}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>{title}</p>
        <h2 style={{ margin: '10px 0 0 0', fontSize: '2.5rem' }}>{value}</h2>
    </div>
);

export default Dashboard;