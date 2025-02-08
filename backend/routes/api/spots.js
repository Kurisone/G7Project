const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, User } = require('../../db/models');


// Validate Spots
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

//Create a Spot
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

// Get All spots
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll();
    return res.json(spots);
  } catch (error) {
    return res.status(500).json({ error: "Incorrect details for your Spot. Please use accurate information." });
  }
});

// Get spot by id
router.get('/:id', async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.id); 
    //   {
    //   include: [
    //     {
    //       model: User,
    //       as: 'Owner',
    //       attributes: ['id', 'firstName', 'lastName']
    //     }
    //   ]
    // });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    return res.json(spot);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//get spots
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

// Get spots by owner id
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

//Edit a spot
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