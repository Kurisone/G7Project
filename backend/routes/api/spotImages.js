const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');

// Route to add an image to a spot
router.post('/spots/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newImage = await SpotImage.create({
      spotId,
      url,
      preview
    });

    return res.status(201).json(newImage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to delete an existing spot image
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  try {
    const spotImage = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
        attributes: ['ownerId']
      }
    });

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    if (spotImage.Spot.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await spotImage.destroy();

    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;