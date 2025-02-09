'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
      static associate(models) {
      // define association here
        
    // Spot.hasMany(models.Booking, {
    // foreignKey: 'spotId'
    // });

    // Booking.belongsTo(models.User, {
    //   foreignKey: 'userId'
    // })
    

    // Booking.belongsTo(models.Spot, { 
    //      foreignKey: 'spotId'
    //  });


     
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