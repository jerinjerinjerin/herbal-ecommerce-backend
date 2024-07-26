import Review from '../modules/review.js';

export const ProductReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment, title } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required.' });
    }

    const newReview = new Review({
      userId,
      productId,
      rating,
      comment,
      title,
    });

    await newReview.save();

    res.status(200).json({
         message: 'Review created successfully.',
         review: newReview,
     });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
