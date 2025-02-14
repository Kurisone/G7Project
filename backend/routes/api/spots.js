//Imports
const express = require('express');
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {NoResourceError} = require('../../utils/customErrors');

// --Sequelize Imports--
const { Spot, User, Review, ReviewImage, SpotImage } = require('../../db/models');
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

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage("Review text is required",),
  check('stars')
    .exists({ checkFalsy: true })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];


// Creating a Review
// Route: /api.spots/:spotId/reviews

router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res, next) => {
  try {

      // How do I grab the spot id that was used on postman
      // req.paramgs is an object of parameters
      // This is one way to grab it
      // const spotId = req.params.spotId
      const {spotId} = req.params;
      const userId = req.user.id;
      const {review, stars} = req.body;
      console.log(userId, "userID");

      // Find out if the spot exists
      const spot = await Spot.findByPk(spotId);
      // if spot does not exist -> it is null
      // If it does not exist -> return an error
      if(!spot){
        // NoResourceError.throw("lolol", 404);
        // const err = new NoResourceError("Spot couldn't be found");
        // err.throwThis();

        let noResourceError = new Error("Spot couldn't be found");
        // add a key value -> for status: 404
        noResourceError.status = 444;
        // Throw the custom error we created
        throw noResourceError;
      }
      // console.log(spot);

      // If it does exist -> See if the current user made a review already]
      const userReview = await Review.findOne({
        where: {
          userId: userId
        }
      });
      // if userReview is null -> we did not make a review already
      if(!userReview){
        // Create the new Review
        const newReview = await Review.create({userId, spotId,review, stars });
        res.status(201);
        return res.json(newReview);
      } else{
          // user already reviewewd this
        let alreadyReviewedError = new Error("User already has a review for this spot");
        // add a key value -> for status: 404
        alreadyReviewedError.status = 500;
        // Throw the custom error we created
        throw alreadyReviewedError;
      }


      // If the current user has not made a review
      //  --- check that all the input data is correct
      //       -- if it is correct -> make the data and send it back
      //      -- if it is not correct, throw an error



      console.log(spotId);


    return res.json(":)")

  } catch (error) {
    next(error);
  }
})



// ROUTE TO GET ALL REVIEWS BASED ON A SPECIFIC SPOT ID
router.get('/:id/reviews', async (req, res, next) => {
  try {
    res.status(201);

    const spotId = req.params.id;
    // SEQUELIZE ---- GRABBING DATA FROM THE DATABASE -> crosses the bridge -> DATABASE
    const reviews = await Review.findAll({
      where: {
        spotId: spotId
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]

        },
        {
          model: ReviewImage,
          attributes: ["id", "reviewId", "url"]
        }
      ]
    });

// --------------- THIS IS HOW WE GET QUERIES USING JAVASCRIPT ------
// NOT VERY EFFICIENT IN TERMS OF PERFORMANCE, BUT GREAT FOR SMALL PROJECTS AND SPRINTS
    // const resReviews = [];

    // // Loop through all the reviews
    // for(let review of reviews){
    //   // Method to turn ugly sequelize objects into pretty javascript objrects
    //   const prettyReview = await review.toJSON();
    //   // console.log("This is one singular review", prettyReview)
    //   // Grab the id from the prettyReview object and use it to get the User associated to that id
    //   let userId = prettyReview.userId;
    //   const userObj = await User.findByPk(userId);
    //   const prettyUser = await userObj.toJSON();
    //   // console.log(prettyUser, "this is the user who made the review");
    //   prettyReview["User"] = prettyUser
    //   resReviews.push(prettyReview);
    //   // console.log("This is one singular review", prettyReview)
    // }


 // TODO
 // - GET RID OF THE USERNAME FROM THE RETURN
 // - GET RID OF THE REVIEWID
 // - GET RID OF THE CREATEDAT AND UPDATEDAT


    /*
     "Reviews": [
        {
          "id": 1, ---
          "userId": 1, ---
          "spotId": 1, ---
          "review": "This was an awesome spot!", ----
          "stars": 5, ----
          "createdAt": "2021-11-19 20:39:36", ----
          "updatedAt": "2021-11-19 20:39:36", -----
          "User": { ---
            "id": 1, ---
            "firstName": "John", ---
            "lastName": "Smith" ---
          },
          "ReviewImages": [ --
            {
              "id": 1, ---
              "url": "image url" ---
            }
          ],
        }
      ]

    */

// ---------- CLEAN UP EACH REVIEW USING JAVASCRIPT ------------
    // let prettyReviews = [];

    // for(let review of reviews){
    //   // Make the review a javascript object
    //   const prettyReview = review.toJSON();
    //   // delete the username from the User object
    //   delete prettyReview.User.username

    //   // add all the reviewImage objects we want to keep into this array
    //   const prettyReviewImages = [];

    //   // loop through each ReviewImages and delete them
    //   for(let reviewImage of prettyReview.ReviewImages){
    //     // delete the createdAt key from each reviewImage
    //     delete reviewImage.createdAt;
    //     // delete the updatedAt keyt from each reviewImage
    //     delete reviewImage.updatedAt;
    //     // Add our reviewImage (modified) to our storage array on line 148
    //     prettyReviewImages.push(reviewImage);

    //   }
    //   // reassign the key-value of our reviewImages with the pretty version
    //   prettyReview.ReviewImages = prettyReviewImages;
    //   // Push all our pretty reviews into our tracker on line 139
    //   prettyReviews.push(prettyReview);
    // }


    return res.json({Reviews: reviews});
    // return res.json({Reviews: prettyReviews});
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
    const spots = await Spot.findAll({
      attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt"],
      include: [
        {model: Review},
        {
          model: SpotImage,
          where: {
            preview: true
          }
        }
      ]
    });

    const prettySpots = [];

    for(let spot of spots){
      const spotObj = await spot.toJSON();
      console.log(spotObj)
      // gett the average of all the reviews per spot
      let sum = 0;
      for(let i = 0; i < spotObj.Reviews.length; i++){
        let review = spotObj.Reviews[i];
        console.log(review);
        sum +=  review.stars;
      }
      const avgRating = sum / spotObj.Reviews.length;
      spotObj.avgRating = avgRating;

      // Get the previewImage
      let previewImageUrl = null;
      for(let previewImage of spotObj.SpotImages){
        if(previewImage.preview === true){
          previewImageUrl = previewImage.url;
        }
      }

      spotObj.previewImage = previewImageUrl;
      delete spotObj.SpotImages;
      delete spotObj.Reviews
      prettySpots.push(spotObj)

    }

    /*
    {
  "Spots": [
    {
      "id": 1, --
      "ownerId": 1, ---
      "address": "123 Disney Lane", ---
      "city": "San Francisco", ---
      "state": "California", --
      "country": "United States of America", --
      "lat": 37.7645358, --
      "lng": -122.4730327, ---
      "name": "App Academy", --
      "description": "Place where web developers are created", --
      "price": 123, --
      "createdAt": "2021-11-19 20:39:36", ---
      "updatedAt": "2021-11-19 20:39:36", ---
      "avgRating": 4.5,
      "previewImage": "image url"
    }
  ]
}



    */
    return res.json({Spots: prettySpots});
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
