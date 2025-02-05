// 'use strict';

<<<<<<< HEAD:backend/db/seeders/01-user.js
// const { User } = require('../models');
// const bcrypt = require("bcryptjs");
=======
const bcrypt = require("bcryptjs");
>>>>>>> staging:backend/db/seeders/01-users.js

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

<<<<<<< HEAD:backend/db/seeders/01-demo-user.js
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//     await User.bulkCreate([
//       {
//         email: 'demo@user.io',
//         username: 'Demo-lition',
//         hashedPassword: bcrypt.hashSync('password')
//       },
//       {
//         email: 'user1@user.io',
//         username: 'FakeUser1',
//         hashedPassword: bcrypt.hashSync('password2')
//       },
//       {
//         email: 'user2@user.io',
//         username: 'FakeUser2',
//         hashedPassword: bcrypt.hashSync('password3')
//       }
//     ], { validate: true });
//   },
=======
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [

      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true, ...options });
  },
>>>>>>> staging:backend/db/seeders/01-user.js

<<<<<<< HEAD:backend/db/seeders/01-user.js
//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     options.tableName = 'Users';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
//     }, {});
//   } 
// }; 
=======
  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
>>>>>>> staging:backend/db/seeders/01-users.js
