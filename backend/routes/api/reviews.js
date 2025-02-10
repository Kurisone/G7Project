//Imports
const express = require('express');
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// --Sequelize Imports--
const { Review } = require('../../db/models');
//review, other?


//--Middleware to protect incoming Data for review creation route-- 
const validateReview = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an address.'),
  check('city') 
    .exists({ checkFalsy: true })
    .withMessage('Please provide a city.'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a state.'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a country.'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Please provide a valid latitude.'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Please provide a valid longitude.'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a name.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a description.'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Please provide a valid price.'),
  handleValidationErrors
];
   





// --Get All Reviews--
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll();
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ error: "Incorrect details for your Review. Please use accurate information." });
  }
});


// --Get Review By Id--
router.get('/:id', async (req, res) => {
   try {
     const review = await Review.findByPk(req.params.id,
     {
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
  
     if (!review) {
        return res.status(404).json({ message: "Review couldn't be found"});
     }

     return res.json(review);
   } catch (error) {
     return res.status(500).json({ error: error.message });
  }
});


// --Get Review by Owner Id--
router.get('/current', requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const review = await Review.findAll({
      where: { ownerId }
    });

    return res.status(200).json(review);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


// --Edit a Spot--
router.put('/:id', requireAuth, validateReview, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
    const review = await Review.findOne({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you do not have permission to edit this review' });
    }

    spot.address = address || spot.address;
    spot.city = city || spot.city;
    spot.state = state || spot.state;
    spot.country = country || spot.country;
    spot.lat = lat || spot.lat;
    spot.lng = lng || spot.lng;
    spot.name = name || spot.name;
    spot.description = description || spot.description;
    spot.price = price || spot.price;

    await spot.save();

    return res.json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      previewImage: null,
      avgRating: null
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating the review' });
  }
});


router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (spot.ownerId !== userId) {
      const err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }

    await spot.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;