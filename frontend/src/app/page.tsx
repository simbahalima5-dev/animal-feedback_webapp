'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Animal, Comment } from '../types';
import { animalsApi, commentsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { AnimalCard } from '../components/AnimalCard';
import { AnimalDetailModal } from '../components/AnimalDetailModal';
import { AuthModal } from '../components/AuthModal';
import { AddAnimalModal } from '../components/AddAnimalModal';
import { Toast } from '../components/Toast';
import { Sparkles, Star, Flame, Compass, MessageSquare } from 'lucide-react';

const CATEGORIES = ['All', 'Mammals', 'Birds', 'Marine Life', 'Reptiles', 'Pets'];

export default function HomePage() {
  const { currentUser } = useAuth();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
  };

  const loadAnimals = useCallback(async () => {
    try {
      const data = await animalsApi.getAll(activeCategory, searchTerm);
      setAnimals(data);
    } catch (err) {
      console.error('Failed to load animals:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  const loadCommentsForAnimal = async (animalId: string) => {
    try {
      const data = await commentsApi.getByAnimal(animalId);
      setCommentsMap(prev => ({ ...prev, [animalId]: data }));
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleOpenAnimal = (animal: Animal) => {
    const animalId = animal._id || animal.id || '';
    setSelectedAnimal(animal);
    if (animalId) {
      loadCommentsForAnimal(animalId);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAddComment = async (payload: { rating: number; tag: string; text: string; avatarColor?: string }) => {
    if (!selectedAnimal) return;
    const animalId = selectedAnimal._id || selectedAnimal.id || '';

    try {
      const created = await commentsApi.create(animalId, payload);
      setCommentsMap(prev => ({
        ...prev,
        [animalId]: [created, ...(prev[animalId] || [])]
      }));

      // Update animal state locally & refetch
      setSelectedAnimal(prev => prev ? {
        ...prev,
        ratingCount: prev.ratingCount + 1,
        ratingSum: prev.ratingSum + payload.rating
      } : null);

      loadAnimals();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit comment.', 'error');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!selectedAnimal) return;
    const animalId = selectedAnimal._id || selectedAnimal.id || '';

    try {
      const updated = await commentsApi.toggleLike(commentId);
      setCommentsMap(prev => ({
        ...prev,
        [animalId]: (prev[animalId] || []).map(c => (c._id === commentId || c.id === commentId ? updated : c))
      }));
    } catch (err: any) {
      showToast(err.message || 'Failed to upvote.', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedAnimal) return;
    const animalId = selectedAnimal._id || selectedAnimal.id || '';

    try {
      await commentsApi.delete(commentId);
      setCommentsMap(prev => ({
        ...prev,
        [animalId]: (prev[animalId] || []).filter(c => c._id !== commentId && c.id !== commentId)
      }));
      showToast('Comment deleted.', 'info');
      loadAnimals();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete comment.', 'error');
    }
  };

  const featuredAnimal = animals.find(a => a.featured) || animals[0];
  const activeAnimalComments = selectedAnimal ? (commentsMap[selectedAnimal._id || selectedAnimal.id || ''] || []) : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        {/* Hero Spotlight */}
        {featuredAnimal && !searchTerm && activeCategory === 'All' && (
          <section className="glass-panel" style={{
            position: 'relative', marginBottom: '40px', overflow: 'hidden',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px', padding: '32px', alignItems: 'center', borderColor: 'var(--border-glow)'
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
                background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-full)',
                color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px'
              }}>
                <Flame size={16} /> Featured Species Spotlight
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
                <button onClick={() => handleOpenAnimal(featuredAnimal)} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  <Star size={18} fill="#042f2e" /> Review & Rate {featuredAnimal.name}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700 }}>
                  <Star size={20} fill="#fbbf24" stroke="none" />
                  <span style={{ fontSize: '1.2rem' }}>
                    {(featuredAnimal.ratingSum / (featuredAnimal.ratingCount || 1)).toFixed(1)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>
                    ({featuredAnimal.ratingCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img src={featuredAnimal.image} alt={featuredAnimal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11, 15, 25, 0.8) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                <span className="badge badge-emerald">#{featuredAnimal.category}</span>
                <span className="badge badge-cyan">#{featuredAnimal.habitat}</span>
              </div>
            </div>
          </section>
        )}

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              Fauna<span className="gradient-text">Pulse Community Feed</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              Next.js + TypeScript + Express.js + MongoDB Atlas + Cloudinary architecture.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span><strong>{animals.length}</strong> Species</span>
            </div>
            <div style={{ height: '14px', width: '1px', background: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span><strong>MongoDB Atlas & Cloudinary</strong> Connected</span>
            </div>
          </div>
        </div>

        {/* Animal Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Loading FaunaPulse Feed...
          </div>
        ) : animals.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Sparkles size={40} style={{ color: 'var(--accent-emerald)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>No animals found</h3>
            <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="btn btn-secondary" style={{ marginTop: '16px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {animals.map((animal) => (
              <AnimalCard
                key={animal._id || animal.id}
                animal={animal}
                commentCount={animal.ratingCount || 0}
                onClick={() => handleOpenAnimal(animal)}
              />
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(11, 15, 25, 0.9)', padding: '24px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
        &copy; 2026 FaunaPulse - Next.js TypeScript + Express.js + MongoDB Atlas + Cloudinary.
      </footer>

      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          comments={activeAnimalComments}
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
          onAnimalAdded={() => { loadAnimals(); }}
          onShowToast={showToast}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
