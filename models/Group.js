const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Group extends Model {}

Group.init({
    // add properites here, ex:
    name: {
         type: DataTypes.STRING,
         allowNull:false
    },
    
},{
    sequelize
});

module.exports=Group