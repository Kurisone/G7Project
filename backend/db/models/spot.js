'use strict';
const { Model, DataTypes } = require('sequelize');

<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
    class Spot extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Spot.belongsTo(models.User, {
                foreignKey: 'ownerId', as: 'Owner'
            });
            Spot.hasMany(models.SpotImage, {
                foreignKey: 'spotId'
            });
            Spot.hasMany(models.Review, {
                foreignKey: 'spotId'
            });
            Spot.hasMany(models.Booking, {
                foreignKey: 'spotId'
            });
        }
    }

    Spot.init(
        {
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
=======

module.exports = (sequelize, DataTypes) => { 
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically. 
     */
    static associate(models) {
      // define association here 
    }
  } 

  Spot.init(
    {
    ownerId: { 
     type: DataTypes.INTEGER, 
     allowNull: false,
     unique: true,
    },
  
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
     len: [3, 256],
    },
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
     len: [3, 256],
    },
  },

  state: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
     len: [3, 256],
    },
  },
>>>>>>> staging

            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },

<<<<<<< HEAD
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            lat: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: false,
                validate: {
                    min: -90,
                    max: 90
                },
            },

            lng: {
                type: DataTypes.DECIMAL(10, 7),
                allowNull: false,
                unique: true,
                validate: {
                    min: -180,
                    max: 180
                },
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 50]
                },
            },

            description: {
                type: DataTypes.Text,
                allowNull: false,

            },

            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            createdAt: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                validate: {
                    len: [3, 256]
                },
            },

            updatedAt: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                validate: {
                    len: [3, 256]
                },
            },
        },

        {
            sequelize,
            modelName: 'Spot',
            defaultScope: {
                attributes: {
                    exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
                },
            },
        }
    );
    return Spot;
=======
  lat: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    unique: true,
    validate: {
      isDecimal: true,
      min: -90,
      max: 90,
    },
  },

  lng: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    unique: true,
    validate: {
      isDecimal: true,
      min: -180,
      max: 180,
    },
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
     len: [3, 256]
    },
  },

  description: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    len: [20, 60]
  },
 },

 price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
     min: 1
    },
  },

  // avgRating: {
  //   type: DataTypes.DECIMAL,
  //   allowNull: true,
  //   validate: {
  //    min: 0,
  //    max: 10,
  //   },
  // },

  // previewImage: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   unique: true,
  //   validate: {
  //    len: [3, 256]
  //   },
  // },
},

  {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  }
);
  return Spot;
>>>>>>> staging
};