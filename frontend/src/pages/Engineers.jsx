import React, { useState, useEffect } from 'react';

const Engineers = () => {
    const [engineers, setEngineers] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        specialization: 'RF', 
        contact: '', 
        availability: 'Available' // Add this 
    });

    useEffect(() => { load(); }, []);
    
    const load = () => {
        fetch('https://cmms-backend-uhr9.onrender.com/engineers')
            .then(res => res.json())
            .then(data => setEngineers(data))
            .catch(err => console.error("Load Error:", err));
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
                load();
            } else {
                const errorData = await response.json();
                console.log("Backend Error Details:", errorData);
                alert("Server rejected the data. Check console.");
            }
        } catch (err) {
            console.error("Connection Error:", err);
        }
    };

    return (
        <div style={{ marginLeft: '260px', padding: '50px' }}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <h1>Engineering Team</h1>
                <button onClick={() => setIsAddOpen(true)} style={s.addBtn}>+ Add Engineer</button>
            </div>
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', marginTop:'30px'}}>
                {engineers.map(eng => (
                    <div key={eng.id} style={s.card}>
                        <small>{eng.eng_id}</small>
                        <h3>{eng.name}</h3>
                        <p>{eng.specialization}</p>
                        <span style={{background: '#dcfce7', padding:'5px 10px', borderRadius:'10px'}}>{eng.status}</span>
                    </div>
                ))}
            </div>

            {isAddOpen && (
                <div style={s.overlay}>
                    <form style={s.modal} onSubmit={handleCreate}>
                        <h2>New Engineer</h2>
                        <input placeholder="Name" required onChange={e => setFormData({...formData, name: e.target.value})} style={s.input}/>
                        <select onChange={e => setFormData({...formData, specialization: e.target.value})} style={s.input}>
                            <option value="RF">RF</option>
                            <option value="Fiber">Fiber</option>
                            <option value="Electrical">Electrical</option>
                        </select>
                        <label>Skill / Specialization</label>
<input onChange={e => setFormData({...formData, specialization: e.target.value})} style={s.input}/>

<label>Availability Status</label>
<select onChange={e => setFormData({...formData, availability: e.target.value})} style={s.input}>
    <option value="Available">Available</option>
    <option value="On-Site">On-Site</option>
    <option value="On Leave">On Leave</option>
    <option value="Standby">Standby</option>
</select>
                        <input placeholder="Contact" required onChange={e => setFormData({...formData, contact: e.target.value})} style={s.input}/>
                        <button type="submit" style={s.saveBtn}>Save Engineer</button>
                        <button type="button" onClick={() => setIsAddOpen(false)} style={s.cancelBtn}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const s = {
    addBtn: { background: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
    card: { background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #ddd' },
    overlay: { position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modal: { background: 'white', padding: '30px', borderRadius: '20px', width: '400px' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' },
    saveBtn: { width: '100%', background: '#3b82f6', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    cancelBtn: { width: '100%', background: 'none', border: 'none', marginTop: '10px', cursor: 'pointer' }
};



export default Engineers;
