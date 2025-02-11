const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');

// Route to add an image to a review
router.put('/reviews/:reviewId/image', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const reviewImagesCount = await ReviewImage.count({ where: { reviewId } });

    if (reviewImagesCount >= 10) {
      return res.status(403).json({ message: 'Maximum number of images for this resource was reached' });
    }

    const newImage = await ReviewImage.create({
      reviewId,
      url
    });

    return res.status(201).json(newImage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to delete an existing review image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  try {
    const reviewImage = await ReviewImage.findByPk(imageId, {
      include: {
        model: Review,
        attributes: ['userId']
      }
    });

    if (!reviewImage) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }

    if (reviewImage.Review.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await reviewImage.destroy();

    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;