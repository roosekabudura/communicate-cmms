import React, { useState, useEffect } from 'react';
import { assetService, workOrderService } from '../services/api'; // Ensure your api.js has workOrderService

const WorkOrders = () => {
    const [workOrders, setWorkOrders] = useState([]);
    const [assets, setAssets] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedWO, setSelectedWO] = useState(null);

    const options = {
        origin: ['Manual', 'PM (Preventive)', 'Predictive (AI)', 'IoT Alert', 'NMS Alarm', 'Customer Request'],
        priority: ['P1-Critical', 'P2-High', 'P3-Medium', 'P4-Routine'],
        sites: ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Bindura', 'Rusape'],
        services: ['5G Voice', 'Broadband', 'Enterprise VPN', 'Cloud Services', 'Camera', 'Printing'],
        teams: ['RF Engineering', 'Fiber Optic', 'Tower Climber', 'NOC/Logical'],
        safety: ['Tower Climbing', 'High Voltage', 'Road Closure', 'RF Radiation'],
        status: ['New', 'Dispatched', 'On-Site', 'In-Progress', 'Pending Parts', 'Completed'],
        causes: ['Hardware Failure', 'Power Outage', 'Cable Cut', 'Software Bug', 'Vandalism']
    };

    const [formData, setFormData] = useState({
        origin: options.origin[0], priority: options.priority[0], asset_id_link: '',
        site_id: options.sites[0], sla_deadline: '', service_affected: options.services[0],
        assigned_team: options.teams[0], safety_permit: options.safety[0],
        status: options.status[0], labor_hours: 0
    });

    useEffect(() => { 
        loadData(); 
    }, []);

    const loadData = async () => {
        const [woRes, assetRes] = await Promise.all([
            fetch('https://cmms-backend-uhr9.onrender.com/work-orders').then(res => res.json()),
            assetService.getAll()
        ]);
        setWorkOrders(woRes);
        setAssets(assetRes.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await fetch('https://cmms-backend-uhr9.onrender.com/work-orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        setIsAddOpen(false);
        loadData();
    };

    const getPriorityColor = (p) => {
        if (p.includes('P1')) return '#ef4444'; // Red
        if (p.includes('P2')) return '#f59e0b'; // Orange
        if (p.includes('P3')) return '#3b82f6'; // Blue
        return '#94a3b8'; // Grey
    };

    return (
        <div style={styles.container}>
            <style>{`
                .hex-grid { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; justify-content: flex-start; }
                .hexagon {
                    width: 200px; height: 115.47px; background-color: #0f172a;
                    position: relative; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; color: white;
                    cursor: pointer; transition: 0.3s; margin: 57.74px 0;
                    border-left: 4px solid #3b82f6; border-right: 4px solid #3b82f6;
                }
                .hexagon::before, .hexagon::after {
                    content: ""; position: absolute; width: 0; border-left: 100px solid transparent; border-right: 100px solid transparent;
                }
                .hexagon::before { bottom: 100%; border-bottom: 57.74px solid #0f172a; }
                .hexagon::after { top: 100%; width: 0; border-top: 57.74px solid #0f172a; }
                .hexagon:hover { transform: scale(1.05); z-index: 5; }
                .hex-content { text-align: center; z-index: 10; width: 100%; padding: 10px; }
                .priority-indicator { position: absolute; top: -40px; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
                
                /* Modal Styling */
                .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 3000; }
                .wo-card { background: white; padding: 40px; border-radius: 20px; width: 700px; max-height: 90vh; overflow-y: auto; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                label { font-size: 0.75rem; font-weight: bold; color: #64748b; margin-bottom: 5px; display: block; }
                select, input, textarea { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; }
            `}</style>

            <div style={styles.header}>
                <h1 style={{fontSize: '2rem', margin: 0}}>Work Order Operations</h1>
                <button onClick={() => setIsAddOpen(true)} style={styles.addBtn}>+ New Work Order</button>
            </div>

            <div className="hex-grid">
                {workOrders.map(wo => (
                    <div key={wo.id} className="hexagon" onClick={() => setSelectedWO(wo)} style={{borderColor: getPriorityColor(wo.priority)}}>
                        <div className="hex-content">
                            <div className="priority-indicator" style={{background: getPriorityColor(wo.priority)}}>{wo.priority}</div>
                            <strong style={{fontSize: '0.9rem'}}>{wo.wo_number}</strong>
                            <div style={{fontSize: '0.65rem', color: '#94a3b8', marginTop: '5px'}}>{wo.asset_id_link}</div>
                            <div style={{fontSize: '0.6rem', marginTop: '5px', color: '#3b82f6'}}>{wo.site_id}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE MODAL */}
            {isAddOpen && (
                <div className="modal-overlay">
                    <form className="wo-card" onSubmit={handleCreate}>
                        <h2 style={{marginBottom: '20px'}}>Initiate Work Order</h2>
                        <div className="form-grid">
                            <div><label>Origin</label><select onChange={e => setFormData({...formData, origin: e.target.value})}>{options.origin.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Priority</label><select onChange={e => setFormData({...formData, priority: e.target.value})}>{options.priority.map(o => <option key={o}>{o}</option>)}</select></div>
                            
                            <div>
                                <label>Target Asset (Searchable)</label>
                                <select required onChange={e => setFormData({...formData, asset_id_link: e.target.value})}>
                                    <option value="">Select Asset...</option>
                                    {assets.map(a => <option key={a.id} value={a.asset_id}>{a.asset_id} - {a.name}</option>)}
                                </select>
                            </div>

                            <div><label>Site ID</label><select onChange={e => setFormData({...formData, site_id: e.target.value})}>{options.sites.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>SLA Deadline</label><input type="datetime-local" required onChange={e => setFormData({...formData, sla_deadline: e.target.value})}/></div>
                            <div><label>Service Affected</label><select onChange={e => setFormData({...formData, service_affected: e.target.value})}>{options.services.map(o => <option key={o}>{o}</option>)}</select></div>
                            <div><label>Assigned Engineer</label><select onChange={e => setFormData({...formData, assigned_engineer: e.target.value})}> <option value="">Unassigned</option> {engineers.map(eng => (
            <option key={eng.id} value={eng.name}>{eng.name} ({eng.specialization})</option>))} </select> </div>
                            
                            <div><label>Safety Permit</label><select onChange={e => setFormData({...formData, safety_permit: e.target.value})}>{options.safety.map(o => <option key={o}>{o}</option>)}</select></div>
                        </div>
                        <button type="submit" style={styles.saveBtn}>Dispatch Work Order</button>
                        <button type="button" onClick={() => setIsAddOpen(false)} style={styles.cancelBtn}>Cancel</button>
                    </form>
                </div>
            )}

            {/* DETAILS MODAL */}
            {selectedWO && (
                <div className="modal-overlay" onClick={() => setSelectedWO(null)}>
                    <div className="wo-card" onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <h2>{selectedWO.wo_number}</h2>
                            <span style={{background: getPriorityColor(selectedWO.priority), color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem'}}>{selectedWO.status}</span>
                        </div>
                        <hr style={{margin: '20px 0', opacity: 0.1}}/>
                        <div className="form-grid">
                            <p><strong>Origin:</strong> {selectedWO.origin}</p>
                            <p><strong>Site:</strong> {selectedWO.site_id}</p>
                            <p><strong>Asset:</strong> {selectedWO.asset_id_link}</p>
                            <p><strong>SLA:</strong> {selectedWO.sla_deadline}</p>
                            <p><strong>Affected:</strong> {selectedWO.service_affected}</p>
                            <p><strong>Safety:</strong> {selectedWO.safety_permit}</p>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <label>Resolution Notes</label>
                            <textarea rows="3" placeholder="Enter resolution details..."></textarea>
                        </div>
                        <button onClick={() => setSelectedWO(null)} style={styles.saveBtn}>Save & Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { marginLeft: '260px', padding: '50px', background: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' },
    addBtn: { background: '#0f172a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    saveBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', width: '100%', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' },
    cancelBtn: { background: 'none', border: 'none', width: '100%', marginTop: '10px', color: '#64748b', cursor: 'pointer' },
};


export default WorkOrders;
