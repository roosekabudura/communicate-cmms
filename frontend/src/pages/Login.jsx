import React, { useState } from 'react';
import { authService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials. Try Again');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e293b' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '4rem', borderRadius: '20px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>CMMS Login</h1>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <label>Email Address</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@communicate.com" />
        
        <label>Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Enter System</button>
      </form>
    </div>
  );
};

export default Login;