'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { animalsApi } from '../lib/api';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnimalAdded: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  onClose,
  onAnimalAdded,
  onShowToast
}) => {
  const [name, setName] = useState<string>('');
  const [scientificName, setScientificName] = useState<string>('');
  const [category, setCategory] = useState<string>('Mammals');
  const [habitat, setHabitat] = useState<string>('');
  const [diet, setDiet] = useState<string>('Carnivore');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('/images/lion.jpg');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const imagePresets = [
    { label: 'African Lion', url: '/images/lion.jpg' },
    { label: 'Red Panda', url: '/images/red_panda.jpg' },
    { label: 'Humpback Whale', url: '/images/whale.jpg' },
    { label: 'Scarlet Macaw', url: '/images/macaw.jpg' },
    { label: 'Snow Leopard', url: '/images/snow_leopard.jpg' },
    { label: 'Golden Retriever', url: '/images/golden_retriever.jpg' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !habitat.trim() || !description.trim()) {
      onShowToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (file) {
        // Cloudinary upload via FormData
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('scientificName', scientificName.trim() || name.trim());
        formData.append('category', category);
        formData.append('habitat', habitat.trim());
        formData.append('diet', diet);
        formData.append('description', description.trim());
        formData.append('photo', file);

        await animalsApi.create(formData);
      } else {
        await animalsApi.create({
          name: name.trim(),
          scientificName: scientificName.trim() || name.trim(),
          category,
          image: imageUrl,
          habitat: habitat.trim(),
          diet,
          description: description.trim()
        });
      }

      onShowToast(`New animal "${name}" added to gallery! 🎉`, 'success');
      onAnimalAdded();
      onClose();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to add animal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-full)', color: '#34d399', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
            <Sparkles size={14} /> Cloudinary & MongoDB Powered
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Add New Animal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Upload photo via Cloudinary SDK or pick preset.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Animal Name *</label>
              <input type="text" className="input-field" style={{ paddingLeft: '16px' }} placeholder="e.g. Cheetah" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="input-group">
              <label className="input-label">Scientific Name</label>
              <input type="text" className="input-field" style={{ paddingLeft: '16px' }} placeholder="e.g. Acinonyx jubatus" value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}>
                <option value="Mammals" style={{ background: '#111827' }}>Mammals</option>
                <option value="Birds" style={{ background: '#111827' }}>Birds</option>
                <option value="Marine Life" style={{ background: '#111827' }}>Marine Life</option>
                <option value="Reptiles" style={{ background: '#111827' }}>Reptiles</option>
                <option value="Pets" style={{ background: '#111827' }}>Pets</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Diet</label>
              <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}>
                <option value="Carnivore" style={{ background: '#111827' }}>Carnivore</option>
                <option value="Herbivore" style={{ background: '#111827' }}>Herbivore</option>
                <option value="Omnivore" style={{ background: '#111827' }}>Omnivore</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Habitat *</label>
            <input type="text" className="input-field" style={{ paddingLeft: '16px' }} placeholder="e.g. African Savanna" value={habitat} onChange={(e) => setHabitat(e.target.value)} required />
          </div>

          {/* Cloudinary File Upload / Presets */}
          <div className="input-group">
            <label className="input-label">Cloudinary Upload or Preset</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ cursor: 'pointer', padding: '8px 16px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-sm)', color: '#22d3ee', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={16} /> Choose Image File
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
              </label>
              {file && <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Selected: {file.name}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {imagePresets.map(preset => (
                <button
                  key={preset.url} type="button" onClick={() => { setImageUrl(preset.url); setFile(null); }}
                  style={{ padding: '6px', borderRadius: 'var(--radius-sm)', border: imageUrl === preset.url && !file ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-main)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                  <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description *</label>
            <textarea rows={3} placeholder="Write details about the species..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }} required />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            <Plus size={18} /> {isSubmitting ? 'Uploading to Cloudinary...' : 'Publish Animal'}
          </button>
        </form>
      </div>
    </div>
  );
};
