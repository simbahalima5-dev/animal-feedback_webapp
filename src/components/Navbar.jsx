import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, LogIn, LogOut, PlusCircle, Sparkles, User, ShieldCheck } from 'lucide-react';

export const Navbar = ({ 
  searchTerm, 
  setSearchTerm, 
  activeCategory, 
  setActiveCategory, 
  categories, 
  onOpenAuth, 
  onOpenAddAnimal, 
  onShowToast 
}) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    const res = logout();
    onShowToast(res.message, 'info');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Top Header Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-emerald) 0%, var(--accent-cyan) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#042f2e',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
                Fauna<span className="gradient-text">Pulse</span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Animal Rating & Community Feedback
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{
            position: 'relative',
            flex: '1',
            maxWidth: '420px',
            minWidth: '240px'
          }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} 
            />
            <input
              type="text"
              placeholder="Search animals by name, species or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'var(--transition)'
              }}
            />
          </div>

          {/* User Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentUser ? (
              <>
                {/* Add Animal CTA */}
                <button 
                  onClick={onOpenAddAnimal}
                  className="btn btn-secondary btn-sm"
                >
                  <PlusCircle size={16} /> Add Animal
                </button>

                {/* Logged-in User Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 12px 6px 6px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: currentUser.avatarColor || 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      @{currentUser.username}
                      <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                  title="Log Out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn btn-primary"
              >
                <LogIn size={18} /> Sign In / Register
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--accent-emerald)' : 'var(--border-color)',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#34d399' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
