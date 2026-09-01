import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  animalId: string;
  username: string;
  avatarColor: string;
  rating: number;
  tag: string;
  text: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  animalId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  avatarColor: { type: String, default: '#10b981' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  tag: { type: String, default: 'Majestic' },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', CommentSchema);
