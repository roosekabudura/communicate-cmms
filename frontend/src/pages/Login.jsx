import React, { useState } from 'react';
import { authService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. We call the login service
      const data = await authService.login(email, password);
      
      // 2. We save the ROLE (admin or staff) so the sidebar knows what to hide
      localStorage.setItem('role', data.role); 
      
      // 3. Go to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials. Try admin@communicate.com / admin123');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e293b', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '3rem', borderRadius: '20px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#0f172a' }}>CMMS Login</h1>
        
        {error && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1rem', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>{error}</p>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="admin@communicate.com" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>
        
        <button type="submit" style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          Enter System
        </button>
      </form>
    </div>
  );
};

export default Login;
