// --Imports--
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// --Utility Imports--
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// --Sequelize Imports--
const { User } = require('../../db/models');



// --Middleware TO Protect Incoming Data For Sign Up Route--
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// --New User Sign Up--
router.post('/', validateSignup, async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);
    return res.status(201).json({ user: safeUser });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Already in use' });
    }
    return res.status(500).json({ error: error.message });
  }
});



// --Get All Users--
router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'username']
    });
    return res.json({ users }); 
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// --GET Requests To The /user/:id Path--
router.get('/user/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email', 'username']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
  


module.exports = router;