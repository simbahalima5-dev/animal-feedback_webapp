import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal extends Document {
  name: string;
  scientificName: string;
  category: string;
  image: string;
  habitat: string;
  diet: string;
  conservationStatus: string;
  description: string;
  tags: string[];
  featured: boolean;
  ratingCount: number;
  ratingSum: number;
  createdAt: Date;
}

const AnimalSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  scientificName: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  habitat: { type: String, required: true },
  diet: { type: String, required: true },
  conservationStatus: { type: String, default: 'Vulnerable' },
  description: { type: String, required: true },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  ratingCount: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAnimal>('Animal', AnimalSchema);
