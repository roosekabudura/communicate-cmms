import React, { useState, useEffect } from 'react';
import { assetService } from '../services/api';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    
    // Filters Restored
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSite, setFilterSite] = useState('All');
    const [filterCondition, setFilterCondition] = useState('All');

    const options = {
        category: ['Network', 'Towers', 'Transport', 'Electrical', 'IT', 'Facilities', 'Satellite'],
        nature: ['Physical', 'Logical', 'Virtual (VNF/SDN)', 'Passive (Towers/Fiber)'],
        criticality: ['1-Low', '2-Medium', '3-High', '4-Mission Critical'],
        status: ['Active', 'Down', 'In-Repair', 'Standby', 'Retired', 'Disposed'],
        condition: ['New', 'Good', 'Fair', 'Poor', 'End-of-Life'],
        site: ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Bindura', 'Rusape'],
        manufacturer: ['ZTE', 'SAMSUNG', 'SONY', 'APPLE', 'HUAWEI', 'SIMBA'],
        team: ['Mechanical', 'Electrical', 'Contractor', 'Facilities']
    };

    const [formData, setFormData] = useState({
        name: '', category: options.category[0], nature: options.nature[0],
        criticality: options.criticality[0], status: options.status[0],
        condition_score: options.condition[0], site: options.site[0],
        manufacturer: options.manufacturer[0], purchase_date: '',
        warranty_expiry: '', assigned_team: options.team[0]
    });

    useEffect(() => { load(); }, []);
    const load = () => assetService.getAll().then(res => setAssets(res.data)).catch(err => console.error(err));

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await assetService.create(formData);
            setIsAddOpen(false);
            load();
        } catch (err) {
            console.error("Backend Error Response:", err.response?.data);
            alert("Create failed. Ensure both Date fields are selected.");
        }
    };

    const getNodeStyle = (asset) => {
        const critColors = { '1-Low': '#94a3b8', '2-Medium': '#3b82f6', '3-High': '#f59e0b', '4-Mission Critical': '#ef4444' };
        const condGlow = { 'New': '0 0 15px #10b981', 'Good': '0 0 10px #22c55e', 'Fair': '0 0 10px #eab308', 'Poor': '0 0 15px #f97316', 'End-of-Life': '0 0 20px #7f1d1d' };
        return { borderColor: critColors[asset.criticality] || '#3b82f6', boxShadow: condGlow[asset.condition_score] || 'none' };
    };

    const filteredAssets = assets.filter(a => 
        (filterStatus === 'All' || a.status === filterStatus) &&
        (filterSite === 'All' || a.site === filterSite) &&
        (filterCondition === 'All' || a.condition_score === filterCondition)
    );

    return (
        <div style={s.container}>
            <style>{`
                .asset-grid { display: flex; flex-wrap: wrap; gap: 35px; }
                .asset-circle { width: 130px; height: 130px; border-radius: 50%; background: #0f172a; border: 5px solid; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; cursor: pointer; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; }
                .asset-circle:hover { transform: scale(1.1); }
                .filter-bar { display: flex; gap: 20px; background: white; padding: 20px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; align-items: center; justify-content: center; }
                .form-card { background: white; width: 650px; padding: 35px; border-radius: 20px; max-height: 90vh; overflow-y: auto; }
                .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
                label { font-size: 0.7rem; font-weight: bold; color: #64748b; margin-bottom: 4px; display: block; }
                input, select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; }
                .legend { display: flex; gap: 15px; margin-bottom: 20px; font-size: 0.75rem; color: #64748b; }
            `}</style>

            <div style={s.header}>
                <h1 style={{fontSize: '2.2rem', margin: 0, fontWeight: '800'}}>Infrastructure Universe</h1>
                <button onClick={() => setIsAddOpen(true)} style={s.addBtn}>+ Register Asset</button>
            </div>

            <div className="legend">
                <span>🔴 Critical</span> <span>🟠 High</span> <span>🔵 Medium</span> <span>⚪ Low</span>
                <span style={{marginLeft: '20px', borderLeft: '1px solid #ddd', paddingLeft: '15px'}}>✨ Glow = Condition Health</span>
            </div>

            <div className="filter-bar">
                <div><label>Status</label>
                    <select onChange={e => setFilterStatus(e.target.value)}><option value="All">All Statuses</option>{options.status.map(o => <option key={o}>{o}</option>)}</select>
                </div>
                <div><label>Site</label>
                    <select onChange={e => setFilterSite(e.target.value)}><option value="All">All Sites</option>{options.site.map(o => <option key={o}>{o}</option>)}</select>
                </div>
                <div><label>Condition</label>
                    <select onChange={e => setFilterCondition(e.target.value)}><option value="All">All Conditions</option>{options.condition.map(o => <option key={o}>{o}</option>)}</select>
                </div>
            </div>

            <div className="asset-grid">
                {filteredAssets.map(a => (
                    <div key={a.id} className="asset-circle" style={getNodeStyle(a)} onClick={() => setSelectedAsset(a)}>
                        <strong style={{fontSize:'0.9rem'}}>{a.asset_id}</strong>
                        <small style={{textAlign:'center', fontSize:'0.65rem', padding:'0 5px'}}>{a.name}</small>
                    </div>
                ))}
            </div>

            {/* DETAIL MODAL */}
            {selectedAsset && (
                <div className="modal-overlay" onClick={() => setSelectedAsset(null)}>
                    <div className="form-card" onClick={e => e.stopPropagation()}>
                        <h2 style={{marginTop:0}}>{selectedAsset.asset_id} Details</h2>
                        <div className="input-grid" style={{background: '#f8fafc', padding:'20px', borderRadius:'12px'}}>
                            <p><strong>Name:</strong> {selectedAsset.name}</p>
                            <p><strong>Category:</strong> {selectedAsset.category}</p>
                            <p><strong>Nature:</strong> {selectedAsset.nature}</p>
                            <p><strong>Criticality:</strong> {selectedAsset.criticality}</p>
                            <p><strong>Site:</strong> {selectedAsset.site}</p>
                            <p><strong>Condition:</strong> {selectedAsset.condition_score}</p>
                            <p><strong>Manufacturer:</strong> {selectedAsset.manufacturer}</p>
                            <p><strong>Status:</strong> {selectedAsset.status}</p>
                        </div>
                        <button onClick={() => setSelectedAsset(null)} style={s.saveBtn}>Close</button>
                    </div>
                </div>
            )}

            {/* ADD MODAL */}
            {isAddOpen && (
                <div className="modal-overlay">
                    <form className="form-card" onSubmit={handleCreate}>
                        <h2 style={{marginBottom: '25px'}}>Register New Asset</h2>
                        <div className="input-grid">
                            <div><label>Name</label><input required onChange={e => setFormData({...formData, name: e.target.value})}/></div>
                            <div><label>Category</label><select onChange={e => setFormData({...formData, category: e.target.value})}>{options.category.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Nature</label><select onChange={e => setFormData({...formData, nature: e.target.value})}>{options.nature.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Criticality</label><select onChange={e => setFormData({...formData, criticality: e.target.value})}>{options.criticality.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Status</label><select onChange={e => setFormData({...formData, status: e.target.value})}>{options.status.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Condition</label><select onChange={e => setFormData({...formData, condition_score: e.target.value})}>{options.condition.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Site</label><select onChange={e => setFormData({...formData, site: e.target.value})}>{options.site.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Manufacturer</label><select onChange={e => setFormData({...formData, manufacturer: e.target.value})}>{options.manufacturer.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Purchase Date</label><input type="date" required onChange={e => setFormData({...formData, purchase_date: e.target.value})}/></div>
                            <div><label>Warranty Expiry</label><input type="date" required onChange={e => setFormData({...formData, warranty_expiry: e.target.value})}/></div>
                        </div>
                        <div className="input-grid">
                            <div><label>Assigned Team</label><select onChange={e => setFormData({...formData, assigned_team: e.target.value})}>{options.team.map(o => <option key={o}>{o}</option>)}</select></div>
                        </div>
                        <button type="submit" style={s.saveBtn}>Create Asset</button>
                        <button type="button" onClick={() => setIsAddOpen(false)} style={s.cancelBtn}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const s = {
    container: { marginLeft: '260px', padding: '50px', background: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    addBtn: { background: '#0f172a', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    saveBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', width: '100%', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' },
    cancelBtn: { background: 'none', border: 'none', width: '100%', marginTop: '10px', color: '#64748b', cursor: 'pointer' }
};

export default Assets;