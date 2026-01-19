import React, { useState, useEffect } from 'react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        part_name: '', category: 'Consumables', quantity: 0, unit_cost: 0.0, location: 'Warehouse A', condition_status: 'New' 
    });

    useEffect(() => { load(); }, []);
    const load = () => fetch('https://cmms-backend-uhr9.onrender.com/inventory').then(res => res.json()).then(setItems);

    const handleCreate = async (e) => {
        e.preventDefault();
        await fetch('https://cmms-backend-uhr9.onrender.com/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setIsAddOpen(false);
        load();
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <h1>Spare Parts Inventory</h1>
                <button onClick={() => setIsAddOpen(true)} style={s.addBtn}>+ Add Item</button>
            </div>

            <div style={s.grid}>
                {items.map(item => (
                    <div key={item.id} style={{
                        ...s.card, 
                        borderLeft: item.quantity < 5 ? '8px solid #ef4444' : '8px solid #10b981',
                        boxShadow: item.quantity < 5 ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none'
                    }}>
                        <h3 style={{margin: '0 0 10px 0'}}>{item.part_name}</h3>
                        <p style={{fontSize: '0.8rem', color: '#64748b'}}>{item.category}</p>
                        <div style={{display:'flex', justifyContent:'space-between', marginTop:'15px', alignItems:'center'}}>
                            <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{item.quantity} <small>pcs</small></span>
                            <span style={s.priceBadge}>${item.unit_cost}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isAddOpen && (
                <div style={s.overlay}>
                    <form style={s.modal} onSubmit={handleCreate}>
                        <h2>Stock Entry</h2>
                        <label style={s.label}>Part Name</label>
                        <input required onChange={e => setFormData({...formData, part_name: e.target.value})} style={s.input}/>
                        <div style={{display:'flex', gap:'10px'}}>
                            <div style={{flex:1}}><label style={s.label}>Quantity</label><input type="number" onChange={e => setFormData({...formData, quantity: e.target.value})} style={s.input}/></div>
                            <div style={{flex:1}}><label style={s.label}>Unit Cost</label><input type="number" step="0.01" onChange={e => setFormData({...formData, unit_cost: e.target.value})} style={s.input}/></div>
                        </div>
                        <label>Condition Status</label>
<select onChange={e => setFormData({...formData, condition_status: e.target.value})} style={s.input}>
    <option value="New">New</option>
    <option value="Refurbished">Refurbished</option>
    <option value="Defective">Defective</option>
</select>
                        <button type="submit" style={s.saveBtn}>Add to Stock</button>
                        <button type="button" onClick={() => setIsAddOpen(false)} style={s.cancelBtn}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const s = {
    container: { marginLeft: '260px', padding: '50px', background: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    addBtn: { background: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', border: 'none', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
    card: { background: 'white', padding: '25px', borderRadius: '15px', transition: '0.3s' },
    priceBadge: { background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' },
    overlay: { position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000 },
    modal: { background: 'white', padding: '30px', borderRadius: '20px', width: '400px' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' },
    label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' },
    saveBtn: { width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    cancelBtn: { width: '100%', background: 'none', border: 'none', marginTop: '10px', color: '#64748b', cursor: 'pointer' }
};


export default Inventory;
