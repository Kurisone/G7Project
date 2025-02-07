//Imports
const express = require('express')
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// --Sequelize Imports--
const { Review } = require('../../db/reviews');


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
  

// --Create New Review--
router.post('/', requireAuth, validateReview, async (req, res) => {
  try {
   const { address, city, state, country, lat, lng, name, description, price } = req.body;
   const ownerId = req.user.id;

   const review = await Review.create({
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
    
    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



// --Get All Reviews--
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll();
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// --Get Review By Id--
router.get('/:id', async (req, res) => {
   try {
     const review = await Review.findByPk(req.params.id);
     if (!review) {
        return res.status(404).json({ error: "Review not found"});
     }
     return res.json(review);
   } catch (error) {
     return res.status(500).json({ error: error.message });
  }
});

module.exports = router;