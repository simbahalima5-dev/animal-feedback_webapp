import { Router, Request, Response } from 'express';
import Comment from '../models/Comment';
import Animal from '../models/Animal';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { inMemoryAnimals } from './animalRoutes';

const router = Router();

let inMemoryComments: any[] = [
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
  },
  {
    _id: 'c-3',
    animalId: 'snow-leopard-1',
    username: 'AlpineHunter',
    avatarColor: '#06b6d4',
    rating: 5,
    tag: 'Enigmatic',
    text: 'Incredible camouflage! You could be looking right at one on a snow cliff and not notice. Ultimate predator.',
    timestamp: '1 day ago',
    likes: 24,
    likedBy: []
  }
];

// GET COMMENTS FOR ANIMAL
router.get('/animals/:animalId/comments', async (req: Request, res: Response) => {
  try {
    const { animalId } = req.params;

    try {
      const dbComments = await Comment.find({ animalId }).sort({ createdAt: -1 });
      if (dbComments.length > 0) {
        return res.json(dbComments);
      }
    } catch (dbErr) {
      // Fallback
    }

    const filtered = inMemoryComments.filter(c => c.animalId === animalId);
    return res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching comments: ' + err.message });
  }
});

// POST COMMENT & UPDATE ANIMAL RATING
router.post('/animals/:animalId/comments', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { animalId } = req.params;
    const { rating, tag, text, avatarColor } = req.body;
    const username = req.user?.username;

    if (!rating || !text) {
      return res.status(400).json({ message: 'Rating and comment text are required.' });
    }

    const numericRating = Number(rating);

    try {
      const newComment = await Comment.create({
        animalId,
        username,
        avatarColor: avatarColor || '#10b981',
        rating: numericRating,
        tag: tag || 'Majestic',
        text: text.trim(),
        likes: 0,
        likedBy: []
      });

      // Update animal rating stats in MongoDB
      await Animal.findByIdAndUpdate(animalId, {
        $inc: { ratingCount: 1, ratingSum: numericRating }
      });

      return res.status(201).json(newComment);
    } catch (dbErr) {
      const memComment = {
        _id: 'comment-' + Date.now(),
        animalId,
        username,
        avatarColor: avatarColor || '#10b981',
        rating: numericRating,
        tag: tag || 'Majestic',
        text: text.trim(),
        timestamp: 'Just now',
        likes: 0,
        likedBy: []
      };

      inMemoryComments.unshift(memComment);

      const targetAnimal = inMemoryAnimals.find(a => a._id === animalId);
      if (targetAnimal) {
        targetAnimal.ratingCount += 1;
        targetAnimal.ratingSum += numericRating;
      }

      return res.status(201).json(memComment);
    }
  } catch (err: any) {
    res.status(500).json({ message: 'Error submitting comment: ' + err.message });
  }
});

// LIKE / UPVOTE COMMENT
router.post('/comments/:id/like', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const username = req.user?.username;

    try {
      const comment = await Comment.findById(id);
      if (comment) {
        const isLiked = comment.likedBy.includes(username!);
        if (isLiked) {
          comment.likedBy = comment.likedBy.filter(u => u !== username);
          comment.likes = Math.max(0, comment.likes - 1);
        } else {
          comment.likedBy.push(username!);
          comment.likes += 1;
        }
        await comment.save();
        return res.json(comment);
      }
    } catch (dbErr) {
      // Fallback
    }

    const memComment = inMemoryComments.find(c => c._id === id);
    if (memComment) {
      const isLiked = memComment.likedBy.includes(username);
      if (isLiked) {
        memComment.likedBy = memComment.likedBy.filter((u: string) => u !== username);
        memComment.likes = Math.max(0, memComment.likes - 1);
      } else {
        memComment.likedBy.push(username);
        memComment.likes += 1;
      }
      return res.json(memComment);
    }

    res.status(404).json({ message: 'Comment not found.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error liking comment: ' + err.message });
  }
});

// DELETE OWN COMMENT
router.delete('/comments/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const username = req.user?.username;

    try {
      const comment = await Comment.findById(id);
      if (comment) {
        if (comment.username !== username) {
          return res.status(403).json({ message: 'You can only delete your own comments.' });
        }
        await Comment.findByIdAndDelete(id);
        await Animal.findByIdAndUpdate(comment.animalId, {
          $inc: { ratingCount: -1, ratingSum: -comment.rating }
        });
        return res.json({ message: 'Comment deleted successfully.' });
      }
    } catch (dbErr) {
      // Fallback
    }

    const memIndex = inMemoryComments.findIndex(c => c._id === id);
    if (memIndex !== -1) {
      const comment = inMemoryComments[memIndex];
      if (comment.username !== username) {
        return res.status(403).json({ message: 'You can only delete your own comments.' });
      }
      inMemoryComments.splice(memIndex, 1);
      return res.json({ message: 'Comment deleted successfully.' });
    }

    res.status(404).json({ message: 'Comment not found.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting comment: ' + err.message });
  }
});

export default router;
