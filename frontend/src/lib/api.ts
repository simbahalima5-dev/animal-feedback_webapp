import axios from 'axios';
import { Animal, Comment, AuthResponse, User } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fauna_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// INITIAL SEED FALLBACKS IF SERVER DISCONNECTED
const FALLBACK_ANIMALS: Animal[] = [
  {
    _id: 'lion-1',
    name: 'African Lion',
    scientificName: 'Panthera leo',
    category: 'Mammals',
    image: '/images/lion.jpg',
    habitat: 'Savannas & Grasslands',
    diet: 'Carnivore',
    conservationStatus: 'Vulnerable',
    description: 'Known as the King of the Jungle, lions are magnificent big cats that live in complex social groups called prides.',
    tags: ['Majestic', 'Regal', 'Wild'],
    featured: true,
    ratingCount: 24,
    ratingSum: 114
  },
  {
    _id: 'red-panda-1',
    name: 'Red Panda',
    scientificName: 'Ailurus fulgens',
    category: 'Mammals',
    image: '/images/red_panda.jpg',
    habitat: 'Eastern Himalayas',
    diet: 'Herbivore (Bamboo)',
    conservationStatus: 'Endangered',
    description: 'Slightly larger than a domestic cat with reddish-brown fur and a bushy tail, known for their playful and curious nature.',
    tags: ['Adorable', 'Cute', 'Rare'],
    featured: true,
    ratingCount: 38,
    ratingSum: 190
  },
  {
    _id: 'whale-1',
    name: 'Humpback Whale',
    scientificName: 'Megaptera novaeangliae',
    category: 'Marine Life',
    image: '/images/whale.jpg',
    habitat: 'Global Oceans',
    diet: 'Krill & Small Fish',
    conservationStatus: 'Least Concern',
    description: 'Famous for their complex underwater songs and spectacular breaching displays, traveling thousands of ocean miles.',
    tags: ['Gentle Giant', 'Mysterious', 'Inspiring'],
    featured: false,
    ratingCount: 19,
    ratingSum: 93
  },
  {
    _id: 'macaw-1',
    name: 'Scarlet Macaw',
    scientificName: 'Ara macao',
    category: 'Birds',
    image: '/images/macaw.jpg',
    habitat: 'Tropical Rainforests',
    diet: 'Fruits & Seeds',
    conservationStatus: 'Least Concern',
    description: 'Strikingly bright tropical parrots with vivid red, yellow, and blue plumage that pair for life.',
    tags: ['Vibrant', 'Intelligent', 'Colorful'],
    featured: false,
    ratingCount: 15,
    ratingSum: 71
  },
  {
    _id: 'snow-leopard-1',
    name: 'Snow Leopard',
    scientificName: 'Panthera uncia',
    category: 'Mammals',
    image: '/images/snow_leopard.jpg',
    habitat: 'High Mountain Ranges',
    diet: 'Carnivore',
    conservationStatus: 'Vulnerable',
    description: 'Elusive big cat known as the "Ghost of the Mountains", expertly camouflaged against rocky alpine snow slopes.',
    tags: ['Stealthy', 'Enigmatic', 'Majestic'],
    featured: true,
    ratingCount: 31,
    ratingSum: 152
  },
  {
    _id: 'retriever-1',
    name: 'Golden Retriever',
    scientificName: 'Canis lupus familiaris',
    category: 'Pets',
    image: '/images/golden_retriever.jpg',
    habitat: 'Domestic / Homes',
    diet: 'Omnivore',
    conservationStatus: 'Domesticated',
    description: 'One of the most beloved dog breeds worldwide, celebrated for their affectionate temperament, intelligence, and loyalty.',
    tags: ['Friendly', 'Playful', 'Loyal'],
    featured: false,
    ratingCount: 45,
    ratingSum: 225
  }
];

const FALLBACK_COMMENTS: Comment[] = [
  {
    _id: 'c-1',
    animalId: 'red-panda-1',
    username: 'NatureLover99',
    avatarColor: '#10b981',
    rating: 5,
    tag: 'Adorable',
    text: 'Literally the cutest creature on planet earth! The way it balances on tree branches is so wholesome 🥹❤️',
    timestamp: '2 hours ago',
    likes: 18,
    likedBy: []
  },
  {
    _id: 'c-2',
    animalId: 'lion-1',
    username: 'SavannaExplorer',
    avatarColor: '#f59e0b',
    rating: 5,
    tag: 'Majestic',
    text: 'Saw one of these kings in Kenya during sunrise! The mane catching the morning rays was an unforgettable sight.',
    timestamp: '5 hours ago',
    likes: 12,
    likedBy: []
  }
];

// AUTH API
export const authApi = {
  register: async (username: string, password: string, confirmPassword?: string): Promise<AuthResponse> => {
    try {
      const res = await api.post<AuthResponse>('/auth/register', { username, password, confirmPassword });
      if (res.data.token) {
        localStorage.setItem('fauna_jwt_token', res.data.token);
      }
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed.');
    }
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await api.post<AuthResponse>('/auth/login', { username, password });
      if (res.data.token) {
        localStorage.setItem('fauna_jwt_token', res.data.token);
      }
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed.');
    }
  }
};

// ANIMALS API
export const animalsApi = {
  getAll: async (category?: string, search?: string): Promise<Animal[]> => {
    try {
      const res = await api.get<Animal[]>('/animals', { params: { category, search } });
      return res.data;
    } catch (err) {
      console.warn('Backend API unreachable, using local data fallback.');
      let results = [...FALLBACK_ANIMALS];
      if (category && category !== 'All') {
        results = results.filter(a => a.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
      }
      return results;
    }
  },

  create: async (formData: FormData | Partial<Animal>): Promise<Animal> => {
    try {
      const res = await api.post<Animal>('/animals', formData, {
        headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create animal.');
    }
  }
};

// COMMENTS & FEEDBACK API
export const commentsApi = {
  getByAnimal: async (animalId: string): Promise<Comment[]> => {
    try {
      const res = await api.get<Comment[]>(`/animals/${animalId}/comments`);
      return res.data;
    } catch (err) {
      return FALLBACK_COMMENTS.filter(c => c.animalId === animalId);
    }
  },

  create: async (animalId: string, payload: { rating: number; tag: string; text: string; avatarColor?: string }): Promise<Comment> => {
    try {
      const res = await api.post<Comment>(`/animals/${animalId}/comments`, payload);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to submit comment.');
    }
  },

  toggleLike: async (commentId: string): Promise<Comment> => {
    try {
      const res = await api.post<Comment>(`/comments/${commentId}/like`);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to upvote.');
    }
  },

  delete: async (commentId: string): Promise<void> => {
    try {
      await api.delete(`/comments/${commentId}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete comment.');
    }
  }
};
