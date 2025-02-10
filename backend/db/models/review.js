'use strict';
 const { Model, DataTypes } = require('sequelize');
 
 
 module.exports = (sequelize, DataTypes) => { 
   class review extends Model {
     /**
      
Helper method for defining associations.
This method is not a part of Sequelize lifecycle.
The models/index file will call this method automatically. */
static associate(models) {// define association here


    //   review.belongsTo(models.Spot, { 
    //     foreignKey: 'spotId'
    //   });

    //   review.belongsTo(models.User, { 
    //     foreignKey: 'UserId'
    //   });

      // review.hasMany(models.ReviewImage, { 
      //   foreignKey: 'reviewId'
      // });


     } 
   } 
 

   review.init(
     {
 

    id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      unique: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
 
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
 
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
       len: [3, 256],
      },
    },
 
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },


   {
     sequelize,
     modelName: 'Review',
     defaultScope: {
       attributes: {
         exclude: ['createdAt', 'updatedAt'],
       },
     },
   }
 );
   return review;
 };