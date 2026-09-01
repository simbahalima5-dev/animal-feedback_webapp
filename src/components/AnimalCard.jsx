import React from 'react';
import { Star, MessageSquare, MapPin, Sparkles, Heart } from 'lucide-react';

export const AnimalCard = ({ animal, commentCount, onClick }) => {
  const avgRating = animal.ratingCount > 0 
    ? (animal.ratingSum / animal.ratingCount).toFixed(1) 
    : 'New';

  return (
    <div 
      className="glass-panel"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'var(--border-glow)';
        e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(16, 185, 129, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        overflow: 'hidden',
        background: '#111827'
      }}>
        <img 
          src={animal.image} 
          alt={animal.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(11, 15, 25, 0.9) 0%, transparent 60%)'
        }} />

        {/* Category Pill */}
        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
          <span className="badge badge-emerald">
            {animal.category}
          </span>
        </div>

        {/* Rating Overlay Badge */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#fbbf24'
        }}>
          <Star size={14} fill="#fbbf24" stroke="none" />
          <span>{avgRating}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 400 }}>
            ({animal.ratingCount})
          </span>
        </div>

        {/* Quick Info Bar at Bottom of Image */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <MapPin size={14} style={{ color: 'var(--accent-teal)' }} />
          <span>{animal.habitat}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {animal.name}
          </h3>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--accent-teal)', margin: 0 }}>
            {animal.scientificName}
          </p>
        </div>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0
        }}>
          {animal.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {animal.tags?.map(tag => (
            <span 
              key={tag} 
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <MessageSquare size={16} style={{ color: 'var(--accent-emerald)' }} />
            <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
          </div>

          <span style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            View & Rate &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
