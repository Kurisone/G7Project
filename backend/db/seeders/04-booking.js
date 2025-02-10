'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Bookings', [

            {
                spotId: 1,
                userId: 1,
                startDate: '2023-01-01',
                endDate: '2023-02-02',
            },

            {
                spotId: 2,
                userId: 2,
                startDate: '2024-01-01',
                endDate: '2024-02-02',
            },

            {
                spotId: 3,
                userId: 3,
                startDate: '2025-01-01',
                endDate: '2025-02-02',
            },

            {
                spotId: 4,
                userId: 4,
                startDate: '2026-01-01',
                endDate: '2026-02-02',
            },

            {
                spotId: 5,
                userId: 5,
                startDate: '2027-01-01',
                endDate: '2027-02-02',
            },

        ], { validate: true });
    },
    async down(queryInterface, Sequelize) {
        options.tableName = 'Bookings';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            spotId: { [Op.in]: ['1', '2', '3', '4', '5'], }
        }, {});
    }
};