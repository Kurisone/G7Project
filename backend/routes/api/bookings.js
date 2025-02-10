// Imports
const express = require('express');
const router = express.Router();

// Utility Imports
const { requireAuth } = require('../../utils/auth');

// Sequelize Imports
const { Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');











module.exports = router;