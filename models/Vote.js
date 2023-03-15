const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {}

Vote.init({
    // add properites here, ex:
},{
    sequelize
});

module.exports=Vote