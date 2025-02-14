'use strict';
 const { Model, DataTypes } = require('sequelize');


 module.exports = (sequelize, DataTypes) => {
   class Review extends Model {
     /**

Helper method for defining associations.
This method is not a part of Sequelize lifecycle.
The models/index file will call this method automatically. */
static associate(models) {// define association here


      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });

      Review.belongsTo(models.User, {
        foreignKey: 'UserId'
      });

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId'
      });


     }
   }


   Review.init(
     {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  },


   {
     sequelize,
     modelName: 'Review',
     defaultScope: {
       attributes: {
       },
     },
   }
 );
   return Review;
 };
