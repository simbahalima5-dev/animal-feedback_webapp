export const INITIAL_ANIMALS = [
  {
    id: "lion-1",
    name: "African Lion",
    scientificName: "Panthera leo",
    category: "Mammals",
    image: "/images/lion.jpg",
    habitat: "Savannas & Grasslands",
    diet: "Carnivore",
    conservationStatus: "Vulnerable",
    description: "Known as the King of the Jungle, lions are magnificent big cats that live in complex social groups called prides.",
    featured: true,
    tags: ["Majestic", "Regal", "Wild"],
    ratingCount: 24,
    ratingSum: 114 // avg ~4.75
  },
  {
    id: "red-panda-1",
    name: "Red Panda",
    scientificName: "Ailurus fulgens",
    category: "Mammals",
    image: "/images/red_panda.jpg",
    habitat: "Eastern Himalayas",
    diet: "Herbivore (Bamboo)",
    conservationStatus: "Endangered",
    description: "Slightly larger than a domestic cat with reddish-brown fur and a bushy tail, known for their playful and curious nature.",
    featured: true,
    tags: ["Adorable", "Cute", "Rare"],
    ratingCount: 38,
    ratingSum: 190 // avg 5.0
  },
  {
    id: "whale-1",
    name: "Humpback Whale",
    scientificName: "Megaptera novaeangliae",
    category: "Marine Life",
    image: "/images/whale.jpg",
    habitat: "Global Oceans",
    diet: "Krill & Small Fish",
    conservationStatus: "Least Concern",
    description: "Famous for their complex underwater songs and spectacular breaching displays, traveling thousands of ocean miles.",
    featured: false,
    tags: ["Gentle Giant", "Mysterious", "Inspiring"],
    ratingCount: 19,
    ratingSum: 93 // avg 4.89
  },
  {
    id: "macaw-1",
    name: "Scarlet Macaw",
    scientificName: "Ara macao",
    category: "Birds",
    image: "/images/macaw.jpg",
    habitat: "Tropical Rainforests",
    diet: "Fruits & Seeds",
    conservationStatus: "Least Concern",
    description: "Strikingly bright tropical parrots with vivid red, yellow, and blue plumage that pair for life.",
    featured: false,
    tags: ["Vibrant", "Intelligent", "Colorful"],
    ratingCount: 15,
    ratingSum: 71 // avg 4.73
  },
  {
    id: "snow-leopard-1",
    name: "Snow Leopard",
    scientificName: "Panthera uncia",
    category: "Mammals",
    image: "/images/snow_leopard.jpg",
    habitat: "High Mountain Ranges",
    diet: "Carnivore",
    conservationStatus: "Vulnerable",
    description: "Elusive big cat known as the 'Ghost of the Mountains', expertly camouflaged against rocky alpine snow slopes.",
    featured: true,
    tags: ["Stealthy", "Enigmatic", "Majestic"],
    ratingCount: 31,
    ratingSum: 152 // avg 4.9
  },
  {
    id: "retriever-1",
    name: "Golden Retriever",
    scientificName: "Canis lupus familiaris",
    category: "Pets",
    image: "/images/golden_retriever.jpg",
    habitat: "Domestic / Homes",
    diet: "Omnivore",
    conservationStatus: "Domesticated",
    description: "One of the most beloved dog breeds worldwide, celebrated for their affectionate temperament, intelligence, and loyalty.",
    featured: false,
    tags: ["Friendly", "Playful", "Loyal"],
    ratingCount: 45,
    ratingSum: 225 // avg 5.0
  }
];

export const INITIAL_COMMENTS = [
  {
    id: "c-1",
    animalId: "red-panda-1",
    username: "NatureLover99",
    avatarColor: "#10b981",
    rating: 5,
    tag: "Adorable",
    text: "Literally the cutest creature on planet earth! The way it balances on tree branches is so wholesome 🥹❤️",
    timestamp: "2 hours ago",
    likes: 18,
    likedBy: []
  },
  {
    id: "c-2",
    animalId: "lion-1",
    username: "SavannaExplorer",
    avatarColor: "#f59e0b",
    rating: 5,
    tag: "Majestic",
    text: "Saw one of these kings in Kenya during sunrise! The mane catching the morning rays was an unforgettable sight.",
    timestamp: "5 hours ago",
    likes: 12,
    likedBy: []
  },
  {
    id: "c-3",
    animalId: "snow-leopard-1",
    username: "AlpineHunter",
    avatarColor: "#06b6d4",
    rating: 5,
    tag: "Enigmatic",
    text: "Incredible camouflage! You could be looking right at one on a snow cliff and not notice. Ultimate predator.",
    timestamp: "1 day ago",
    likes: 24,
    likedBy: []
  },
  {
    id: "c-4",
    animalId: "whale-1",
    username: "DeepBlueBio",
    avatarColor: "#3b82f6",
    rating: 5,
    tag: "Gentle Giant",
    text: "Listening to humpback whale song recordings under water gives me chills every time. Pure marine poetry.",
    timestamp: "2 days ago",
    likes: 9,
    likedBy: []
  },
  {
    id: "c-5",
    animalId: "retriever-1",
    username: "DogPal_Sam",
    avatarColor: "#ec4899",
    rating: 5,
    tag: "Playful",
    text: "Always ready with a stick and a smile! Best companion anyone could ever ask for.",
    timestamp: "3 days ago",
    likes: 31,
    likedBy: []
  }
];

export const INITIAL_USERS = [
  {
    username: "demo_user",
    password: "password123",
    joinedDate: "2026-08-01"
  },
  {
    username: "wildlife_enthusiast",
    password: "password123",
    joinedDate: "2026-08-15"
  }
];
