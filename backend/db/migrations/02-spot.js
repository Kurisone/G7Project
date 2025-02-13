'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

  await queryInterface.createTable('Spots', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, 
        type: Sequelize.INTEGER
      },

      ownerId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        // unique: true
      //   references: {
      //     model: 'Users',
      //     key: 'id'
      // }
      },
    
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      city: {
        type: Sequelize.STRING,
        allowNull: false
      },

      state: {
        type: Sequelize.STRING,
        allowNull: false
      },

      country: {
        type: Sequelize.STRING,
        allowNull: false
      },

      lat: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        unique: true
      },

      lng: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        unique: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      description: {
        type: Sequelize.STRING,
        allowNull: false
      },

      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      
      
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      // avgRating: {
      //   type: Sequelize.DECIMAL, //-> don't put aggregate data on db. 
      //   allowNull: false,
      //     defaultvalue: 0,
      // },

      // previewImage: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },

    }, options);
  },
  async down(queryInterface, Sequelize) {
 
    options.tableName = "Spots";
    return queryInterface.dropTable(options);
  }
};