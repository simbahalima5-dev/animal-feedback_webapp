'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, X, LogIn, UserPlus, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onShowToast
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg('');
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const res = await login(username, password);
      if (res.success) {
        onShowToast(res.message, 'success');
        onClose();
        resetForm();
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = await register(username, password, confirmPassword);
      if (res.success) {
        onShowToast(res.message, 'success');
        onClose();
        resetForm();
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const fillDemoAccount = () => {
    setUsername('demo_user');
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px', position: 'relative' }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px', background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: 'var(--radius-full)', color: '#34d399', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Sparkles size={16} /> WildPulse Community
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Sign in to post feedback & rate your favorite animals.' : 'Register to join animal lovers worldwide.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
          <button
            type="button" onClick={() => handleSwitchMode('login')}
            style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', background: mode === 'login' ? 'var(--accent-emerald)' : 'transparent', color: mode === 'login' ? '#042f2e' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <LogIn size={16} /> Sign In
          </button>

          <button
            type="button" onClick={() => handleSwitchMode('register')}
            style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', background: mode === 'register' ? 'var(--accent-emerald)' : 'transparent', color: mode === 'register' ? '#042f2e' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-sm)', color: '#fda4af', fontSize: '0.875rem', marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} /> <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text" className="input-field" placeholder="e.g. WildlifeExplorer"
                value={username} onChange={(e) => setUsername(e.target.value)} required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Enter password"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
              <button type="button" className="input-toggle-btn" style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'} className="input-field" placeholder="Re-enter password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                />
                <button type="button" className="input-toggle-btn" style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginTop: '4px', color: password === confirmPassword ? '#34d399' : '#fda4af' }}>
                  {password === confirmPassword ? <><CheckCircle2 size={14} /> Passwords match</> : <><AlertCircle size={14} /> Passwords do not match</>}
                </div>
              )}
            </div>
          )}

          {mode === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-subtle)' }}>Test account credentials?</span>
              <button type="button" onClick={fillDemoAccount} style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>
                Auto-fill demo user
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '1rem' }}>
            {mode === 'login' ? <><LogIn size={18} /> Log In</> : <><UserPlus size={18} /> Complete Registration</>}
          </button>
        </form>
      </div>
    </div>
  );
};
