import React, { useState, useEffect } from 'react';

const PreventiveMaint = () => {
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        asset_name: '', task_description: '', frequency: 'Monthly', next_due_date: '', assigned_team: ''
    });

    useEffect(() => { fetch('http://127.0.0.1:8000/pm-schedules').then(r => r.json()).then(setSchedules); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        await fetch('http://127.0.0.1:8000/pm-schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setIsModalOpen(false);
        // Refresh list logic here...
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>PM Schedules (Preventive)</h2>
                <button onClick={() => setIsModalOpen(true)} style={s.addBtn}>+ Schedule PM</button>
            </div>

            <div style={s.grid}>
                {schedules.map(pm => (
                    <div key={pm.id} style={s.card}>
                        <div style={s.badge}>{pm.frequency}</div>
                        <h3>{pm.asset_name}</h3>
                        <p style={{fontSize: '0.9rem', color: '#64748b'}}>{pm.task_description}</p>
                        <hr style={{border: '0.5px solid #f1f5f9'}}/>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.8rem'}}>
                            <span>Next Due: <strong>{pm.next_due_date}</strong></span>
                            <span style={{color: '#3b82f6'}}>{pm.assigned_team}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Logic would go here similarly to Assets... */}
        </div>
    );
};

const s = {
    addBtn: { background: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'relative' },
    badge: { position: 'absolute', top: '15px', right: '15px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' }
};

export default PreventiveMaint;