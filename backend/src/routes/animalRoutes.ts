import { Router, Request, Response } from 'express';
import Animal from '../models/Animal';
import { uploadCloudinary } from '../config/cloudinary';

const router = Router();

// Pre-seeded fallback data
let inMemoryAnimals = [
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

// GET ALL ANIMALS
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    try {
      let query: any = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { name: searchRegex },
          { scientificName: searchRegex },
          { description: searchRegex }
        ];
      }

      const dbAnimals = await Animal.find(query).sort({ ratingSum: -1 });
      if (dbAnimals.length > 0) {
        return res.json(dbAnimals);
      }
    } catch (dbErr) {
      // Fallthrough to memory
    }

    // Memory filter
    let results = [...inMemoryAnimals];
    if (category && category !== 'All') {
      results = results.filter(a => a.category === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.description.toLowerCase().includes(q)
      );
    }
    return res.json(results);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching animals: ' + err.message });
  }
});

// CREATE NEW ANIMAL WITH CLOUDINARY UPLOAD SUPPORT
router.post('/', uploadCloudinary.single('photo'), async (req: Request, res: Response) => {
  try {
    const { name, scientificName, category, habitat, diet, description, imageUrl } = req.body;

    if (!name || !habitat || !description) {
      return res.status(400).json({ message: 'Name, habitat, and description are required.' });
    }

    // Determine final image URL (from Cloudinary upload file or imageUrl body)
    let finalImageUrl = imageUrl || '/images/lion.jpg';
    if (req.file && (req.file as any).path) {
      finalImageUrl = (req.file as any).path; // Cloudinary secure CDN URL
    }

    const newAnimalData = {
      name: name.trim(),
      scientificName: scientificName?.trim() || name.trim(),
      category: category || 'Mammals',
      image: finalImageUrl,
      habitat: habitat.trim(),
      diet: diet || 'Carnivore',
      conservationStatus: 'Protected',
      description: description.trim(),
      tags: ['Community Submission', category || 'Mammals'],
      featured: false,
      ratingCount: 0,
      ratingSum: 0
    };

    try {
      const dbAnimal = await Animal.create(newAnimalData);
      return res.status(201).json(dbAnimal);
    } catch (dbErr) {
      const memAnimal = { ...newAnimalData, _id: 'animal-' + Date.now() };
      inMemoryAnimals.unshift(memAnimal as any);
      return res.status(201).json(memAnimal);
    }
  } catch (err: any) {
    res.status(500).json({ message: 'Error adding animal: ' + err.message });
  }
});

export { inMemoryAnimals };
export default router;
