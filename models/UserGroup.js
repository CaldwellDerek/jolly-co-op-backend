const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Usergroup extends Model {}

Usergroup.init({
    // add properites here, ex:
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      }
},{
    sequelize
});

module.exports= Usergroup