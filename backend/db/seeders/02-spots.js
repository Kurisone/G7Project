'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { 
    /**
     * Add seed commands here.
     * 
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert ( 'Spots', [ 
      {

        
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
      },

      {

        
        ownerId: 2,
        address: "456 Disney Land",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 42.4368942,
        lng: -111.4267436,
        name: "DisneyApp Land",
        description: "Place where web developers are created",
        price: 123,
      },

      {

        
        ownerId: 3,
        address: "789 Disney Lane",
        city: "San Diego",
        state: "California",
        country: "United States of America",
        lat: 67.9812248,
        lng: -212.9987643,
        name: "Sea World",
        description: "Place where web developers love to swim",
        price: 123,
      },

      {

        
        ownerId: 4,
        address: "454 Disney Lane",
        city: "Malibu",
        state: "California",
        country: "United States of America",
        lat: 99.3892734,
        lng: -311.9734529,
        name: "Malibu Mansions",
        description: "Place where web developers build mansions",
        price: 123,
      },

      {

        
        ownerId: 5,
        address: "713 Disney Lane",
        city: "Long Beach",
        state: "California",
        country: "United States of America",
        lat: 56.3947564,
        lng: -542.9485763,
        name: "Beach Academy",
        description: "Place where web developers are created",
        price: 123,
      },

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  } 
}; 