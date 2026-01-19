import React, { useState, useEffect } from 'react';

const Engineers = () => {
    const [engineers, setEngineers] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        specialization: 'RF', 
        contact: '', 
        availability: 'Available' 
    });

    useEffect(() => { load(); }, []);
    
    const load = () => {
        fetch('https://cmms-backend-uhr9.onrender.com/engineers')
            .then(res => res.json())
            .then(data => setEngineers(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Load Error:", err);
                setEngineers([]); // Prevents crash on error
            });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://cmms-backend-uhr9.onrender.com/engineers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsAddOpen(false);
                setFormData({ name: '', specialization: 'RF', contact: '', availability: 'Available' }); // Reset form
                load();
            } else {
                alert("Server rejected the data. Check if eng_id is required.");
            }
        } catch (err) {
            console.error("Connection Error:", err);
        }
    };

    const handleToggleAvailability = async (engineerId, currentAvailability) => {
      const newStatus = currentAvailability === "Available" ? "Not Available" : "Available";
      try {
          await fetch(`https://cmms-backend-uhr9.onrender.com/engineers/${engineerId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ availability: newStatus })
          });
          load(); 
      } catch (error) {
          alert("Could not update status. Is the Backend PATCH route ready?");
      }
    };
    
    return (
        <div style={{ marginLeft: '260px', padding: '50px' }}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <h1>Engineering Team</h1>
                <button onClick={() => setIsAddOpen(true)} style={s.addBtn}>+ Add Engineer</button>
            </div>
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', marginTop:'30px'}}>
                {(engineers || []).map(eng => (
                    <div key={eng.id} style={s.card}>
                        <small style={{color:'#64748b'}}>{eng.eng_id || 'TEMP-ID'}</small>
                        <h3>{eng.name}</h3>
                        <p><strong>Skill:</strong> {eng.specialization}</p>
                        <p><strong>Contact:</strong> {eng.contact}</p>
                        
                        <div style={{ margin: '15px 0' }}>
                            <span style={{ 
                                color: eng.availability === 'Available' ? '#16a34a' : '#dc2626',
                                fontWeight: 'bold',
                                backgroundColor: eng.availability === 'Available' ? '#f0fdf4' : '#fef2f2',
                                padding: '5px 10px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                border: `1px solid ${eng.availability === 'Available' ? '#bbf7d0' : '#fecaca'}`
                            }}>
                                {eng.availability || 'Available'}
                            </span>
                        </div>

                        <button 
                            onClick={() => handleToggleAvailability(eng.id, eng.availability)}
                            style={s.toggleBtn}
                        >
                            Change Status
                        </button>
                    </div>
                ))}
            </div>

            {isAddOpen && (
                <div style={s.overlay}>
                    <form style={s.modal} onSubmit={handleCreate}>
                        <h2>New Engineer</h2>
                        <input 
                            placeholder="Full Name" 
                            value={formData.name}
                            required 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            style={s.input}
                        />
                        
                        <label>Specialization</label>
                        <select 
                            value={formData.specialization}
                            onChange={e => setFormData({...formData, specialization: e.target.value})} 
                            style={s.input}
                        >
                            <option value="RF">RF</option>
                            <option value="Fiber">Fiber</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Mechanical">Mechanical</option>
                        </select>

                        <input 
                            placeholder="Phone / Email" 
                            value={formData.contact}
                            required 
                            onChange={e => setFormData({...formData, contact: e.target.value})} 
                            style={s.input}
                        />
                        
                        <button type="submit" style={s.saveBtn}>Save Engineer</button>
                        <button type="button" onClick={() => setIsAddOpen(false)} style={s.cancelBtn}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const s = {
    addBtn: { background: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: 'none' },
    card: { background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
    toggleBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%', marginTop: '10px', fontWeight: '500' },
    overlay: { position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
    modal: { background: 'white', padding: '30px', borderRadius: '20px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' },
    saveBtn: { width: '100%', background: '#3b82f6', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { width: '100%', background: 'none', border: 'none', marginTop: '10px', cursor: 'pointer', color: '#64748b' }
};

export default Engineers;
