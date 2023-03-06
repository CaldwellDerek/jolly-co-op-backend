const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Nomination extends Model {}

Nomination.init({
    // add properites here, ex:
},{
    sequelize
});

module.exports=Nomination