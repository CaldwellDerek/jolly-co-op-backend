const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Game extends Model {}
//TODO: wait for api response from Derek 
Game.init({
    // add properites here, ex:
    name: {
         type: DataTypes.STRING,
         allowNull:false
    },
    platforms:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rating:{
        type:DataTypes.INTEGER
    },
    genres:{
        type:DataTypes.STRING,
    },
    imgURL:{
        type:DataTypes.TEXT
    }
},{
    sequelize
});

module.exports=Game