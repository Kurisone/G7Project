const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { Spot, Review, User, ReviewImage, SpotImage } = require('../../db/models');

// Validation middleware for review data
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: errors.array().reduce((acc, error) => {
          acc[error.param] = error.msg;
          return acc;
        }, {})
      });
    }
    next();
  }
];

// Route to get all reviews written by the current user
router.get('/reviews/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              where: { preview: true },
              required: false
            }
          ]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const formattedReviews = reviews.map(review => {
      const reviewData = review.toJSON();
      if (reviewData.Spot && reviewData.Spot.SpotImages && reviewData.Spot.SpotImages.length > 0) {
        reviewData.Spot.previewImage = reviewData.Spot.SpotImages[0].url;
      } else {
        reviewData.Spot.previewImage = null;
      }
      delete reviewData.Spot.SpotImages;
      return reviewData;
    });

    return res.json({ Reviews: formattedReviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to get all reviews for a specified spot
router.get('/spots/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    return res.json({ Reviews: reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to create a new review for a spot
router.post('/spots/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const existingReview = await Review.findOne({
      where: { spotId, userId }
    });

    if (existingReview) {
      return res.status(403).json({ message: "Review already exists for this spot from the current user" });
    }

    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars
    });

    return res.status(201).json(newReview);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



// Route to update an existing review
router.put('/reviews/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  try {
    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    existingReview.review = review;
    existingReview.stars = stars;
    await existingReview.save();

    return res.json(existingReview);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to delete an existing review
router.delete('/reviews/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await review.destroy();

    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;