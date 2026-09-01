export interface User {
  username: string;
  avatarColor?: string;
}

export interface Animal {
  _id?: string;
  id?: string;
  name: string;
  scientificName: string;
  category: string;
  image: string;
  habitat: string;
  diet: string;
  conservationStatus: string;
  description: string;
  tags: string[];
  featured?: boolean;
  ratingCount: number;
  ratingSum: number;
}

export interface Comment {
  _id?: string;
  id?: string;
  animalId: string;
  username: string;
  avatarColor: string;
  rating: number;
  tag: string;
  text: string;
  timestamp?: string;
  likes: number;
  likedBy: string[];
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}
