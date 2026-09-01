'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type?: 'info' | 'success' | 'error' } | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.95)',
    error: 'rgba(244, 63, 94, 0.95)',
    info: 'rgba(6, 182, 212, 0.95)'
  };

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000,
      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px',
      background: bgColors[toast.type || 'info'], backdropFilter: 'blur(12px)',
      color: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      fontWeight: 600, fontSize: '0.9rem', maxWidth: '400px'
    }}>
      <Icon size={20} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </div>
  );
};
