'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class SpotImage extends Model {
        static associate(models) {
            // define association here
        }
    }
    SpotImage.init(
        {
            spotId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },

            preview: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'SpotImage',
            // defaultScope: {
            //     attributes: {
            //       exclude: ['createdAt', 'updatedAt'],
            //     },
            //   },
        }
    );
    return SpotImage;
};