import React, { useState, useEffect } from 'react';

const Reports = () => {
    const [stats, setStats] = useState({
        pmRatio: 0,
        correctiveRatio: 0,
        mttr: 0,
        totalTasks: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [woRes, pmRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/work-orders').then(r => r.json()),
                    fetch('http://127.0.0.1:8000/pm-schedules').then(r => r.json())
                ]);

                const total = woRes.length + pmRes.length;
                const pmPct = total > 0 ? (pmRes.length / total) * 100 : 0;
                
                setStats({
                    pmRatio: pmPct.toFixed(1),
                    correctiveRatio: (100 - pmPct).toFixed(1),
                    mttr: 4.2, // This is a placeholder until we add labor_hours to WOs
                    totalTasks: total
                });
            } catch (err) {
                console.error("Failed to load report data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <h1 style={{ fontWeight: '800', marginBottom: '30px' }}>Operational Analytics</h1>

            {/* KPI Scorecards */}
            <div style={s.kpiGrid}>
                <div style={s.kpiCard}>
                    <p style={s.kpiLabel}>PM Compliance</p>
                    <h2 style={s.kpiValue}>{stats.pmRatio}%</h2>
                    <div style={s.progressBar}><div style={{...s.progressFill, width: `${stats.pmRatio}%`, backgroundColor: '#10b981'}}></div></div>
                </div>
                <div style={s.kpiCard}>
                    <p style={s.kpiLabel}>Corrective Ratio</p>
                    <h2 style={s.kpiValue}>{stats.correctiveRatio}%</h2>
                    <div style={s.progressBar}><div style={{...s.progressFill, width: `${stats.correctiveRatio}%`, backgroundColor: '#ef4444'}}></div></div>
                </div>
                <div style={s.kpiCard}>
                    <p style={s.kpiLabel}>Avg. Repair Time (MTTR)</p>
                    <h2 style={s.kpiValue}>{stats.mttr} hrs</h2>
                </div>
                <div style={s.kpiCard}>
                    <p style={s.kpiLabel}>Total Maintenance Events</p>
                    <h2 style={s.kpiValue}>{stats.totalTasks}</h2>
                </div>
            </div>

            {/* Visual Analytics Row */}
            <div style={s.chartRow}>
                <div style={s.chartBox}>
                    <h3>Maintenance Distribution</h3>
                    <p>Comparison of Planned vs. Reactive Work</p>
                    <div style={{marginTop: '40px'}}>
                        <div style={s.barRow}><span>Preventive</span><strong>{stats.pmRatio}%</strong></div>
                        <div style={s.barRow}><span>Corrective</span><strong>{stats.correctiveRatio}%</strong></div>
                    </div>
                </div>
                <div style={s.chartBox}>
                    <h3>Downtime Impact Heatmap</h3>
                    <div style={s.placeholderChart}>[Data Visualization Loading...]</div>
                </div>
            </div>
        </div>
    );
};

const s = {
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
    kpiCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    kpiLabel: { color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' },
    kpiValue: { fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 15px 0' },
    progressBar: { height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' },
    progressFill: { height: '100%', transition: 'width 0.5s ease' },
    chartRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    chartBox: { background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    barRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '10px', borderBottom: '1px solid #f8fafc' },
    placeholderChart: { height: '150px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', borderRadius: '10px', marginTop: '20px', border: '1px dashed #cbd5e1' }
};

export default Reports;