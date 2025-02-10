'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ReviewImage extends Model {
        static associate(models) {
            // define association here
        }
    }

 ReviewImage.init(
        {

            ReviewId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },

        },
        {
            sequelize,
            modelName: 'ReviewImage',
            // defaultScope: {
            //     attributes: {
            //         exclude: ['createdAt', 'updatedAt'],
            //     },
            // },
        }
    );
    return ReviewImage;
};