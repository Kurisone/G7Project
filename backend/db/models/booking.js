'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      // define association here
    }
  }

  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        // validate: {
        //   isDate: true,
        // },
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        // validate: {
        //   isDate: true,
        // },
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      // defaultScope: {
      //   attributes: {
      //     exclude: ['createdAt', 'updatedAt'],
      //   },
      // },
    }
  );

  return Booking;
};
