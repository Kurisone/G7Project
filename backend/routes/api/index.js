// ----IMPORTS----
// --Express imports
const usersRouter = require('./users.js');
const express = require('express')
const sessionRouter = require('./session.js');
const spotsRouter = require('./spots.js');

// --Sequelize imports
const { User } = require('../../db/models');

// -- Middleware Imports-- Condensed to one line of code
const { restoreUser, setTokenCookie, requireAuth } = require('../../utils/auth.js');
//const { setTokenCookie } = require('../../utils/auth.js');
//const { requireAuth } = require('../../utils/auth.js');

// --Middleware--
const router = express.Router()
router.use(restoreUser);

// --Routes for API--
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);


// --Routes--
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

// GET /api/set-token-cookie
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// GET /api/restore-user
router.get('/restore-user', (req, res) => {
  return res.json(req.user);
}
);

// GET /api/require-auth
router.get('/require-auth', requireAuth, (req, res) => {
  return res.json(req.user);
}
);
// Keep this route to test frontend setup in Mod 5
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;