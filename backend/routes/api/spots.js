//Imports
const express = require('express')
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// --Sequelize Imports--
const { Spot } = require('../../db/models');


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
  }
});



// --Get All Spots--
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll();
    return res.json(spots);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


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
});

module.exports = router;