import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Star, 
  X, 
  Heart, 
  MessageSquare, 
  Send, 
  MapPin, 
  Utensils, 
  ShieldAlert, 
  Trash2, 
  Tag, 
  LogIn, 
  Award,
  Filter
} from 'lucide-react';

export const AnimalDetailModal = ({ 
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

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState('Majestic');
  const [commentText, setCommentText] = useState('');
  
  // Rating filter for comments list
  const [filterRating, setFilterRating] = useState('ALL');

  if (!animal) return null;

  const tagOptions = ['Majestic', 'Cute', 'Adorable', 'Fascinating', 'Playful', 'Rare', 'Gentle Giant', 'Stealthy'];

  const ratingDescriptions = {
    1: 'Needs Improvement 😕',
    2: 'Okay 😐',
    3: 'Cool Animal 🙂',
    4: 'Awesome! 🦁',
    5: 'Obsessed! 🤩'
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!commentText.trim()) {
      onShowToast('Please write a comment before submitting feedback.', 'error');
      return;
    }

    const newComment = {
      id: 'comment-' + Date.now(),
      animalId: animal.id,
      username: currentUser.username,
      avatarColor: currentUser.avatarColor || '#10b981',
      rating: rating,
      tag: selectedTag,
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      likedBy: []
    };

    onAddComment(newComment, animal.id, rating);
    
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      // Ignore if confetti fails
    }

    onShowToast('Feedback submitted successfully! Thank you 🎉', 'success');
    setCommentText('');
    setRating(5);
  };

  // Calculate average rating
  const avgRating = animal.ratingCount > 0 
    ? (animal.ratingSum / animal.ratingCount).toFixed(1) 
    : '5.0';

  // Filter comments based on star rating filter
  const filteredComments = comments.filter(c => {
    if (filterRating === 'ALL') return true;
    return c.rating === parseInt(filterRating);
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '840px',
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Modal Header with Animal Hero Banner */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '300px',
          background: '#040812'
        }}>
          <img 
            src={animal.image} 
            alt={animal.name} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #111827 0%, rgba(17, 24, 39, 0.4) 60%, rgba(0, 0, 0, 0.6) 100%)'
          }} />

          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          {/* Animal Details Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '28px',
            right: '28px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-emerald">{animal.category}</span>
                <span className="badge badge-amber">
                  <ShieldAlert size={12} /> {animal.conservationStatus}
                </span>
              </div>

              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1 }}>
                {animal.name}
              </h2>
              <p style={{ fontStyle: 'italic', color: 'var(--accent-teal)', margin: 0, fontSize: '0.95rem' }}>
                {animal.scientificName}
              </p>
            </div>

            {/* Rating summary pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glow)'
            }}>
              <Star size={24} fill="#fbbf24" stroke="none" />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                  {avgRating} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 5</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Based on {animal.ratingCount} reviews
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '28px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}>
          {/* Quick Species Info Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            padding: '16px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
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

          {/* Description */}
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
            {animal.description}
          </p>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Feedback Form Section */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} style={{ color: 'var(--accent-emerald)' }} />
              Submit Your Animal Feedback
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Share your rating, impression, and observations with the community.
            </p>

            {currentUser ? (
              <form onSubmit={handleFormSubmit}>
                {/* Interactive Star Rating Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                    Your Star Rating:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'transform 0.15s ease'
                          }}
                          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <Star 
                            size={28} 
                            fill={isFilled ? "#fbbf24" : "none"} 
                            stroke={isFilled ? "#fbbf24" : "var(--text-subtle)"} 
                          />
                        </button>
                      );
                    })}
                    <span style={{ 
                      marginLeft: '10px', 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      color: 'var(--accent-amber)' 
                    }}>
                      {ratingDescriptions[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                {/* Tag Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                    Choose a Tag:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tagOptions.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTag(t)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: selectedTag === t ? 'var(--accent-emerald)' : 'var(--border-color)',
                          background: selectedTag === t ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: selectedTag === t ? '#34d399' : 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Text Input */}
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="input-label" style={{ margin: 0 }}>Your Comment & Thoughts</label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {commentText.length}/300
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write a thoughtful comment about this animal..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      outline: 'none'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  <Send size={18} /> Post Feedback
                </button>
              </form>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-color)'
              }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.9rem' }}>
                  You must be logged in to rate animals and post comments.
                </p>
                <button 
                  onClick={onOpenAuth}
                  className="btn btn-primary btn-sm"
                >
                  <LogIn size={16} /> Sign In or Register Now
                </button>
              </div>
            )}
          </div>

          {/* Feedback & Comments Feed */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Community Feedback ({comments.length})
              </h3>

              {/* Filter Comments by Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} style={{ color: 'var(--text-subtle)' }} />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="ALL" style={{ background: '#111827' }}>All Ratings</option>
                  <option value="5" style={{ background: '#111827' }}>5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value="4" style={{ background: '#111827' }}>4 Stars ⭐⭐⭐⭐</option>
                  <option value="3" style={{ background: '#111827' }}>3 Stars ⭐⭐⭐</option>
                </select>
              </div>
            </div>

            {filteredComments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                background: 'rgba(15, 23, 42, 0.3)',
                borderRadius: 'var(--radius-md)'
              }}>
                <MessageSquare size={32} style={{ color: 'var(--text-subtle)', marginBottom: '8px' }} />
                <p>No feedback found for this filter. Be the first to leave a comment!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredComments.map((item) => {
                  const isUserComment = currentUser && currentUser.username === item.username;
                  const isLiked = currentUser && item.likedBy?.includes(currentUser.username);

                  return (
                    <div 
                      key={item.id}
                      style={{
                        padding: '18px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      {/* Comment Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: item.avatarColor || 'var(--accent-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.95rem'
                          }}>
                            {item.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                              @{item.username}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                              {item.timestamp}
                            </div>
                          </div>
                        </div>

                        {/* Rating & Tag */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.tag && (
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(6, 182, 212, 0.12)',
                              color: '#22d3ee',
                              border: '1px solid rgba(6, 182, 212, 0.2)'
                            }}>
                              #{item.tag}
                            </span>
                          )}

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#fbbf24'
                          }}>
                            <Star size={12} fill="#fbbf24" stroke="none" />
                            {item.rating}
                          </div>
                        </div>
                      </div>

                      {/* Comment Body */}
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.925rem', 
                        color: 'var(--text-main)', 
                        lineHeight: 1.5 
                      }}>
                        {item.text}
                      </p>

                      {/* Comment Footer: Likes & Actions */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <button
                          onClick={() => onLikeComment(item.id)}
                          style={{
                            background: isLiked ? 'rgba(244, 63, 94, 0.15)' : 'none',
                            border: isLiked ? '1px solid rgba(244, 63, 94, 0.3)' : 'none',
                            color: isLiked ? '#f43f5e' : 'var(--text-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            transition: 'var(--transition)'
                          }}
                        >
                          <Heart 
                            size={16} 
                            fill={isLiked ? "#f43f5e" : "none"} 
                            className={isLiked ? "heart-bump" : ""} 
                          />
                          <span>{item.likes || 0} Helpful</span>
                        </button>

                        {isUserComment && (
                          <button
                            onClick={() => onDeleteComment(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#fda4af',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem',
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)'
                            }}
                            title="Delete your comment"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
