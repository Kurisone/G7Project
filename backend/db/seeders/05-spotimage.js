'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([

      {
        spotId: 1,
        url: "https://spotimage.com/spot1-preview.jpg",
        preview: true
      },

      {
        spotId: 2,
        url: "https://spotimage.com/spot2-preview.jpg",
        preview: true
      },

      {
        spotId: 3,
        url: "https://spotimage.com/spot3-preview.jpg",
        preview: true
      },

      {
        spotId: 4,
        url: "https://spotimage.com/spot4-preview.jpg",
        preview: true
      },

      {
        spotId: 5,
        url: "https://spotimage.com/spot5-preview.jpg",
        preview: true
      },
      
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
   options.tableName = 'SpotImages';
   const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: [
        'https://spotimage.com/spot1-preview.jpg', 
        'https://spotimage.com/spot2-preview.jpg', 
        'https://spotimage.com/spot3-preview.jpg', 
        'https://spotimage.com/spot4-preview.jpg',
        'https://spotimage.com/spot5-preview.jpg'] 
        }
    }, {}) 
  }
};