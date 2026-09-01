'use client';

import React, { useState } from 'react';
import { Animal, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Star, X, Heart, MessageSquare, Send, MapPin, Utensils, ShieldAlert, Trash2, LogIn, Award, Filter } from 'lucide-react';

interface AnimalDetailModalProps {
  animal: Animal;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (payload: { rating: number; tag: string; text: string; avatarColor?: string }) => void;
  onLikeComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onOpenAuth: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  animal,
  comments,
  onClose,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onOpenAuth,
  onShowToast
}) => {
  const { currentUser } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<string>('Majestic');
  const [commentText, setCommentText] = useState<string>('');
  const [filterRating, setFilterRating] = useState<string>('ALL');

  if (!animal) return null;

  const tagOptions = ['Majestic', 'Cute', 'Adorable', 'Fascinating', 'Playful', 'Rare', 'Gentle Giant', 'Stealthy'];
  const ratingDescriptions: Record<number, string> = {
    1: 'Needs Improvement 😕',
    2: 'Okay 😐',
    3: 'Cool Animal 🙂',
    4: 'Awesome! 🦁',
    5: 'Obsessed! 🤩'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!commentText.trim()) {
      onShowToast('Please write a comment before submitting.', 'error');
      return;
    }

    onAddComment({
      rating,
      tag: selectedTag,
      text: commentText.trim(),
      avatarColor: currentUser.avatarColor || '#10b981'
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err) {}

    onShowToast('Feedback posted! Thank you 🎉', 'success');
    setCommentText('');
    setRating(5);
  };

  const avgRating = animal.ratingCount > 0 ? (animal.ratingSum / animal.ratingCount).toFixed(1) : '5.0';
  const filteredComments = comments.filter(c => filterRating === 'ALL' || c.rating === parseInt(filterRating));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}
      >
        <div style={{ position: 'relative', width: '100%', height: '300px', background: '#040812' }}>
          <img src={animal.image} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111827 0%, rgba(17, 24, 39, 0.4) 60%, rgba(0, 0, 0, 0.6) 100%)' }} />

          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '20px', right: '20px', background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid var(--border-color)', borderRadius: '50%', width: '38px', height: '38px',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          <div style={{ position: 'absolute', bottom: '20px', left: '28px', right: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-emerald">{animal.category}</span>
                <span className="badge badge-amber"><ShieldAlert size={12} /> {animal.conservationStatus}</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1 }}>{animal.name}</h2>
              <p style={{ fontStyle: 'italic', color: 'var(--accent-teal)', margin: 0, fontSize: '0.95rem' }}>{animal.scientificName}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.85)', padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' }}>
              <Star size={24} fill="#fbbf24" stroke="none" />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                  {avgRating} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 5</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on {animal.ratingCount} reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} style={{ color: 'var(--accent-emerald)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Habitat</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{animal.habitat}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Utensils size={20} style={{ color: 'var(--accent-amber)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Diet</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{animal.diet}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={20} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{animal.conservationStatus}</div>
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{animal.description}</p>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Feedback Form */}
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} style={{ color: 'var(--accent-emerald)' }} /> Submit Animal Feedback
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Select your rating, pick a tag, and write your observation.
            </p>

            {currentUser ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Star Rating:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((s) => {
                      const isFilled = s <= (hoverRating || rating);
                      return (
                        <button
                          key={s} type="button" onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        >
                          <Star size={28} fill={isFilled ? "#fbbf24" : "none"} stroke={isFilled ? "#fbbf24" : "var(--text-subtle)"} />
                        </button>
                      );
                    })}
                    <span style={{ marginLeft: '10px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                      {ratingDescriptions[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Tag:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tagOptions.map(t => (
                      <button
                        key={t} type="button" onClick={() => setSelectedTag(t)}
                        style={{
                          padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                          border: '1px solid', borderColor: selectedTag === t ? 'var(--accent-emerald)' : 'var(--border-color)',
                          background: selectedTag === t ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: selectedTag === t ? '#34d399' : 'var(--text-muted)', cursor: 'pointer'
                        }}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="input-label" style={{ margin: 0 }}>Comment Text</label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{commentText.length}/300</span>
                  </div>
                  <textarea
                    rows={3} placeholder="Write your thoughts..." value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', resize: 'vertical', outline: 'none' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  <Send size={18} /> Post Feedback
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.9rem' }}>Sign in to post feedback and rate animals.</p>
                <button onClick={onOpenAuth} className="btn btn-primary btn-sm">
                  <LogIn size={16} /> Sign In or Register
                </button>
              </div>
            )}
          </div>

          {/* Comment Stream */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Community Feedback ({comments.length})</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} style={{ color: 'var(--text-subtle)' }} />
                <select
                  value={filterRating} onChange={(e) => setFilterRating(e.target.value)}
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: '0.85rem' }}
                >
                  <option value="ALL" style={{ background: '#111827' }}>All Ratings</option>
                  <option value="5" style={{ background: '#111827' }}>5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value="4" style={{ background: '#111827' }}>4 Stars ⭐⭐⭐⭐</option>
                </select>
              </div>
            </div>

            {filteredComments.map((item) => {
              const commentId = item._id || item.id || '';
              const isUserComment = currentUser && currentUser.username === item.username;
              const isLiked = currentUser && item.likedBy?.includes(currentUser.username);

              return (
                <div key={commentId} style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: item.avatarColor || 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                        {item.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>@{item.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{item.timestamp || 'Recently'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.tag && <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee' }}>#{item.tag}</span>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(245, 158, 11, 0.12)', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
                        <Star size={12} fill="#fbbf24" stroke="none" /> {item.rating}
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{item.text}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <button
                      onClick={() => onLikeComment(commentId)}
                      style={{ background: isLiked ? 'rgba(244, 63, 94, 0.15)' : 'none', border: isLiked ? '1px solid rgba(244, 63, 94, 0.3)' : 'none', color: isLiked ? '#f43f5e' : 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
                    >
                      <Heart size={16} fill={isLiked ? "#f43f5e" : "none"} /> <span>{item.likes || 0} Helpful</span>
                    </button>

                    {isUserComment && (
                      <button onClick={() => onDeleteComment(commentId)} style={{ background: 'none', border: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
