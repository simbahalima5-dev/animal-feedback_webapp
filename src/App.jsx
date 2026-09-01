import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AnimalCard } from './components/AnimalCard';
import { AnimalDetailModal } from './components/AnimalDetailModal';
import { AuthModal } from './components/AuthModal';
import { AddAnimalModal } from './components/AddAnimalModal';
import { Toast } from './components/Toast';
import { INITIAL_ANIMALS, INITIAL_COMMENTS } from './data/initialData';
import { Sparkles, Star, Flame, Heart, Award, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

const CATEGORIES = ['All', 'Mammals', 'Birds', 'Marine Life', 'Reptiles', 'Pets'];

function MainApp() {
  const { currentUser } = useAuth();

  // Data state with localStorage persistence
  const [animals, setAnimals] = useState(() => {
    const saved = localStorage.getItem('fauna_animals');
    return saved ? JSON.parse(saved) : INITIAL_ANIMALS;
  });

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('fauna_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  useEffect(() => {
    localStorage.setItem('fauna_animals', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('fauna_comments', JSON.stringify(comments));
  }, [comments]);

  // UI & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal states
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Open Auth helper
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Add Comment Handler
  const handleAddComment = (newComment, animalId, rating) => {
    setComments(prev => [newComment, ...prev]);

    // Update rating stats on animal
    setAnimals(prev => prev.map(anim => {
      if (anim.id === animalId) {
        return {
          ...anim,
          ratingCount: anim.ratingCount + 1,
          ratingSum: anim.ratingSum + rating
        };
      }
      return anim;
    }));
  };

  // Like / Upvote Comment Handler
  const handleLikeComment = (commentId) => {
    if (!currentUser) {
      handleOpenAuth('login');
      showToast('Please log in to upvote comments.', 'info');
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const likedBy = c.likedBy || [];
        const isAlreadyLiked = likedBy.includes(currentUser.username);
        const newLikedBy = isAlreadyLiked
          ? likedBy.filter(u => u !== currentUser.username)
          : [...likedBy, currentUser.username];
        const newLikes = isAlreadyLiked ? Math.max(0, c.likes - 1) : c.likes + 1;
        return { ...c, likes: newLikes, likedBy: newLikedBy };
      }
      return c;
    }));
  };

  // Delete Comment Handler
  const handleDeleteComment = (commentId) => {
    const commentToDelete = comments.find(c => c.id === commentId);
    if (!commentToDelete) return;

    setComments(prev => prev.filter(c => c.id !== commentId));

    // Update animal rating stats
    setAnimals(prev => prev.map(anim => {
      if (anim.id === commentToDelete.animalId) {
        const newCount = Math.max(0, anim.ratingCount - 1);
        const newSum = Math.max(0, anim.ratingSum - commentToDelete.rating);
        return { ...anim, ratingCount: newCount, ratingSum: newSum };
      }
      return anim;
    }));

    showToast('Comment deleted.', 'info');
  };

  // Add New Animal Handler
  const handleAddAnimal = (newAnimal) => {
    setAnimals(prev => [newAnimal, ...prev]);
  };

  // Filter animals by category & search term
  const filteredAnimals = animals.filter(animal => {
    const matchesCategory = activeCategory === 'All' || animal.category === activeCategory;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      animal.name.toLowerCase().includes(searchLower) ||
      animal.scientificName.toLowerCase().includes(searchLower) ||
      animal.description.toLowerCase().includes(searchLower) ||
      animal.tags.some(t => t.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  // Featured Animal for Hero Spotlight
  const featuredAnimal = animals.find(a => a.featured) || animals[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={CATEGORIES}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenAddAnimal={() => setIsAddAnimalOpen(true)}
        onShowToast={showToast}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Hero Spotlight Banner */}
        {featuredAnimal && !searchTerm && activeCategory === 'All' && (
          <section className="glass-panel" style={{
            position: 'relative',
            marginBottom: '40px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            padding: '32px',
            alignItems: 'center',
            borderColor: 'var(--border-glow)'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(245, 158, 11, 0.15)',
                borderRadius: 'var(--radius-full)',
                color: '#fbbf24',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '16px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <Flame size={16} /> Featured Species of the Week
              </div>

              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px 0', lineHeight: 1.1 }}>
                {featuredAnimal.name}
              </h2>
              <p style={{ fontStyle: 'italic', color: 'var(--accent-teal)', margin: '0 0 16px 0', fontSize: '1.05rem' }}>
                {featuredAnimal.scientificName}
              </p>

              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.95rem' }}>
                {featuredAnimal.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedAnimal(featuredAnimal)}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                  <Star size={18} fill="#042f2e" /> Review & Rate {featuredAnimal.name}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700 }}>
                  <Star size={20} fill="#fbbf24" stroke="none" />
                  <span style={{ fontSize: '1.2rem' }}>
                    {(featuredAnimal.ratingSum / featuredAnimal.ratingCount).toFixed(1)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>
                    ({featuredAnimal.ratingCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img 
                src={featuredAnimal.image} 
                alt={featuredAnimal.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11, 15, 25, 0.8) 0%, transparent 50%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                gap: '8px'
              }}>
                <span className="badge badge-emerald">#{featuredAnimal.category}</span>
                <span className="badge badge-cyan">#{featuredAnimal.habitat}</span>
              </div>
            </div>
          </section>
        )}

        {/* Section Header & Stats Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              Animal <span className="gradient-text">Feedback Feed</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              Showing {filteredAnimals.length} species in community review.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span><strong>{animals.length}</strong> Species</span>
            </div>
            <div style={{ height: '14px', width: '1px', background: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span><strong>{comments.length}</strong> Total Reviews</span>
            </div>
          </div>
        </div>

        {/* Animal Cards Grid */}
        {filteredAnimals.length === 0 ? (
          <div className="glass-panel" style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)'
          }}>
            <Sparkles size={40} style={{ color: 'var(--accent-emerald)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              No animals found matching "{searchTerm}"
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              Try searching another term or change your category filter.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {filteredAnimals.map((animal) => {
              const animalCommentsCount = comments.filter(c => c.animalId === animal.id).length;
              return (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  commentCount={animalCommentsCount}
                  onClick={() => setSelectedAnimal(animal)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(11, 15, 25, 0.9)',
        padding: '24px',
        textAlign: 'center',
        marginTop: '60px',
        color: 'var(--text-subtle)',
        fontSize: '0.875rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            &copy; 2026 FaunaPulse Animal Feedback App. Built with React & Vite.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy</span>
            <span>Community Guidelines</span>
            <span>Wildlife Conservation</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          comments={comments.filter(c => c.animalId === selectedAnimal.id)}
          onClose={() => setSelectedAnimal(null)}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onDeleteComment={handleDeleteComment}
          onOpenAuth={() => handleOpenAuth('login')}
          onShowToast={showToast}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
          onShowToast={showToast}
        />
      )}

      {isAddAnimalOpen && (
        <AddAnimalModal
          isOpen={isAddAnimalOpen}
          onClose={() => setIsAddAnimalOpen(false)}
          onAddAnimal={handleAddAnimal}
          onShowToast={showToast}
        />
      )}

      {/* Toast Alert System */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
