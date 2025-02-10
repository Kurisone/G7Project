// Imports
const express = require('express');
const router = express.Router();

// Utility Imports
const { requireAuth } = require('../../utils/auth');

// Sequelize Imports
const { Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');

// // Validation Spot Images
// const validateImageId = [
//   check('url')
//     .exists({checkFalsy: true})
//     .isURL()
//     .withMessage('Please provide a URL.')

//   check('preview')
//     .optional()
//     .isBoolean()
//     .withMessage('Preveiw has to be True or False'),

//   handleValidationErrors
// ];


// Delete a spot image by id
router.delete('/:imageId', requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const imageId = Number(req.params.imageId);

    if (isNaN(imageId)) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

// Look for the image in the database
    const spotImage = await SpotImage.findOne({ where: { id: imageId } });
    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image not found" });
    }

// Find the spot associated with this image
    const spot = await Spot.findOne({ where: { id: spotImage.spotId } });
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

// Only the owner of the Spot can delete the image
    if (spot.ownerId !== ownerId) {
      return res.status(403).json({ message: "You don't have authorization to delete this image." });
    }

// Remove the image from the database
    await spotImage.destroy();

    return res.status(200).json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error("Error deleting spot image:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;


// An authenticated user is required for a successful response

// Only the owner of the spot is authorized to delete

// Image record is removed from the database after request

// Success response includes a message indicating a successful deletion

// Error response with status 404 is given when a spot image does not exist
// with the provided id