//Imports
const express = require('express');
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// --Sequelize Imports--
const { Spot, User, Review } = require('../../db/models');
//models?; spot, user?


// --Validate Spots--
const validateSpot = [
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

/*
// ROUTE TO GET ALL REVIEWS BASED ON A SPECIFIC SPOT ID
router.get('/:id/reviews', async (req, res, next) => {
  try {
    return res.json(":)");
  } catch (error) {
    console.log("starting point")
    next(error);
  }
})


*/


// PREFIXED WITH: /api/spots/


// ROUTE TO GET ALL REVIEWS BASED ON A SPECIFIC SPOT ID
router.get('/:id/reviews', async (req, res, next) => {
  try {
    res.status(201);

    const spotId = req.params.id;
    // SEQUELIZE ---- GRABBING DATA FROM THE DATABASE
    const reviews = await Review.findAll({
      where: {
        spotId: spotId
      }
    });

    /*
     "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "spotId": 1,
          "review": "This was an awesome spot!",
          "stars": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image url"
            }
          ],
        }
      ]

    */

    return res.json({Reviews: reviews});
  } catch (error) {
    console.log("starting point")
    next(error);
  }
})




// --Create a Spot--
router.post('/', requireAuth, validateSpot, async (req, res) => {
  try {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;

    const spot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    return res.status(201).json(spot);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


// --Get All spots--
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll();
    return res.json(spots);
  } catch (error) {
    return res.status(500).json({ error: "Incorrect details for your Spot. Please use accurate information." });
  }
});


// --Get Spot by Id--
router.get('/:id', async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.id,
      {
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    return res.json(spot);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// --Get Spots by Owner Id--
router.get('/currentUser', requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const spot = await Spot.findAll({
      where: { ownerId }
    });

    return res.status(200).json(spot);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


// --Edit a Spot--
router.put('/:id', requireAuth, validateSpot, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
    const spot = await Spot.findOne({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!spot) {
      return res.status(404).json({ message: 'Spot not found or you do not have permission to edit this spot' });
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
    return res.status(500).json({ message: 'An error occurred while updating the spot' });
  }
});

module.exports = router;
