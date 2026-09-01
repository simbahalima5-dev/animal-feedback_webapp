import React, { useState } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';

export const AddAnimalModal = ({ isOpen, onClose, onAddAnimal, onShowToast }) => {
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState('Mammals');
  const [habitat, setHabitat] = useState('');
  const [diet, setDiet] = useState('Carnivore');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/lion.jpg');

  if (!isOpen) return null;

  const imagePresets = [
    { label: 'African Lion', url: '/images/lion.jpg' },
    { label: 'Red Panda', url: '/images/red_panda.jpg' },
    { label: 'Humpback Whale', url: '/images/whale.jpg' },
    { label: 'Scarlet Macaw', url: '/images/macaw.jpg' },
    { label: 'Snow Leopard', url: '/images/snow_leopard.jpg' },
    { label: 'Golden Retriever', url: '/images/golden_retriever.jpg' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !habitat.trim() || !description.trim()) {
      onShowToast('Please fill out all required fields.', 'error');
      return;
    }

    const newAnimal = {
      id: 'animal-' + Date.now(),
      name: name.trim(),
      scientificName: scientificName.trim() || name.trim(),
      category: category,
      image: imageUrl,
      habitat: habitat.trim(),
      diet: diet,
      conservationStatus: 'Protected',
      description: description.trim(),
      featured: false,
      tags: ['Community Favorite', category],
      ratingCount: 0,
      ratingSum: 0
    };

    onAddAnimal(newAnimal);
    onShowToast(`New animal "${name}" added to gallery! 🎉`, 'success');
    onClose();
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
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            background: 'rgba(16, 185, 129, 0.15)',
            borderRadius: 'var(--radius-full)',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            <Sparkles size={14} /> Community Showcase
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
            Add a New Animal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Expand the fauna collection for community reviews.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Animal Name *</label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. Cheetah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Scientific Name</label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. Acinonyx jubatus"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              >
                <option value="Mammals" style={{ background: '#111827' }}>Mammals</option>
                <option value="Birds" style={{ background: '#111827' }}>Birds</option>
                <option value="Marine Life" style={{ background: '#111827' }}>Marine Life</option>
                <option value="Reptiles" style={{ background: '#111827' }}>Reptiles</option>
                <option value="Pets" style={{ background: '#111827' }}>Pets</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Diet</label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              >
                <option value="Carnivore" style={{ background: '#111827' }}>Carnivore</option>
                <option value="Herbivore" style={{ background: '#111827' }}>Herbivore</option>
                <option value="Omnivore" style={{ background: '#111827' }}>Omnivore</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Habitat *</label>
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '16px' }}
              placeholder="e.g. African Savanna, Coral Reefs"
              value={habitat}
              onChange={(e) => setHabitat(e.target.value)}
              required
            />
          </div>

          {/* Preset Image Selector */}
          <div className="input-group">
            <label className="input-label">Select Photo Asset</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {imagePresets.map(preset => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: imageUrl === preset.url ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                    background: imageUrl === preset.url ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-main)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description *</label>
            <textarea
              rows={3}
              placeholder="Write a short summary about this species..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            <Plus size={18} /> Publish Animal to Feed
          </button>
        </form>
      </div>
    </div>
  );
};
