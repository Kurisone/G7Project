auth-setup

// --Imports--


staging
const express = require('express')
const router = express.Router();

// --Utility Imports--
 auth-setup
const { requireAuth } = require('../../utils/auth');

staging
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// --Sequelize Imports--
const { Spot, Sequelize } = require('../../db/models');

const router = express.Router();

// -- Protects incoming Data for spot creation route--
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

auth-setup
//--Middleware to protect incoming Data for spot creation route-- 
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
  


// --Create New Spot--
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
    return res.status(500).json({ error: error.message });

staging
  }

  // Set token cookie
  await setTokenCookie(res, req.user);

  // Return the new spot data
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
    updatedAt: spot.updatedAt
  });
});

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

auth-setup

// --Get All Spots--
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll();
    return res.json(spots);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

staging
});

// a middleware sub-stack shows request info for any type of HTTP request to the /spot/:id path
router.use('/spot/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
}, (req, res, next) => {
  console.log('Request Type:', req.method);
  next();

auth-setup
// --Get Spot By Id--
router.get('/:id', async (req, res) => {
   try {
     const spot = await Spot.findByPk(req.params.id);
     if (!spot) {
        return res.status(404).json({ error: "Spot not found"});
     }
     return res.json(spot);
   } catch (error) {
     return res.status(500).json({ error: error.message });
  }
staging
});

module.exports = router;
