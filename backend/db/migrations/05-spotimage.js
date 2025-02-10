'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/* @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SpotImages', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Spots",
          key: 'id'
        },
        onDelete: 'CASCADE'

      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },

      preview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') //SQLITE_ERROR: table SpotImages has no column named createdAt
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') //SQLITE_ERROR: table SpotImages has no column named updatedAt
      }
      
    }, options);
  },
  
  async down(queryInterface, Sequelize) {
    options.tableName = "Spot Images";
    await queryInterface.dropTable(options);
  }
};