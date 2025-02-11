const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Booking, Spot, SpotImage, User } = require('../../db/models');

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage('Please provide a valid start date.'),
  check('endDate')
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage('Please provide a valid end date.'),
  handleValidationErrors
];

// Route to create a new booking
router.post('/spots/:spotId/bookings', requireAuth, validateBooking, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const existingBooking = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    if (existingBooking) {
      return res.status(403).json({
        message: 'Sorry, this spot is already booked for the specified dates',
        errors: {
          startDate: 'Start date conflicts with an existing booking',
          endDate: 'End date conflicts with an existing booking'
        }
      });
    }

    const booking = await Booking.create({
      userId,
      spotId,
      startDate,
      endDate
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to get all bookings made by the current user
router.get('/bookings/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
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
        }
      ]
    });

    const formattedBookings = bookings.map(booking => {
      const bookingData = booking.toJSON();
      if (bookingData.Spot && bookingData.Spot.SpotImages && bookingData.Spot.SpotImages.length > 0) {
        bookingData.Spot.previewImage = bookingData.Spot.SpotImages[0].url;
      } else {
        bookingData.Spot.previewImage = null;
      }
      delete bookingData.Spot.SpotImages;
      return bookingData;
    });

    return res.json({ Bookings: formattedBookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Route to get all bookings for a specified spot
router.get('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const isOwner = spot.ownerId === userId;

    const bookings = await Booking.findAll({
      where: { spotId },
      include: isOwner
        ? [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        : []
    });

    if (isOwner) {
      return res.json({ Bookings: bookings });
    } else {
      const formattedBookings = bookings.map(booking => {
        const { spotId, startDate, endDate } = booking;
        return { spotId, startDate, endDate };
      });
      return res.json({ Bookings: formattedBookings });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to update an existing booking
router.put('/bookings/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const currentDate = new Date();
    if (currentDate > new Date(booking.endDate)) {
      return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    const existingBooking = await Booking.findOne({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: bookingId },
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    if (existingBooking) {
      return res.status(403).json({
        message: 'Sorry, this spot is already booked for the specified dates',
        errors: {
          startDate: 'Start date conflicts with an existing booking',
          endDate: 'End date conflicts with an existing booking'
        }
      });
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Route to delete an existing booking
router.delete('/bookings/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: {
        model: Spot,
        attributes: ['ownerId']
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    const currentDate = new Date();
    if (currentDate > new Date(booking.startDate)) {
      return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
    }

    if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await booking.destroy();

    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
