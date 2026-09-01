import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
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

  const Icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  };

  const IconComponent = Icons[toast.type] || Info;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      background: bgColors[toast.type] || bgColors.info,
      backdropFilter: 'blur(12px)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      fontWeight: 600,
      fontSize: '0.9rem',
      maxWidth: '400px',
      animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <IconComponent size={20} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
