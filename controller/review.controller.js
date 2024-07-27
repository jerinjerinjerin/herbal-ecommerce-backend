import Review from '../modules/review.js';
//create review
export const ProductReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment, title, name, profilePic } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required.' });
    }

    const newReview = new Review({
      userId,
      productId,
      rating,
      comment,
      title,
      profilePic,
      name,
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

//get all reviews for a product

export const GetProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const reviews = await Review.find({ productId });

    res.status(200).json({ 
      reviews,
      message: 'Reviews retrieved successfully.', 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
