// const sequelize = require("../config/connection");
// const { User, Play } = require("../models");

// const users = [
//   {
//     email: "joe@joe.joe",
//     password: "password",
//     username: "joejoe",
//   },
//   {
//     email: "arra@arra.arra",
//     password: "password1",
//     username: "arra",
//   },
//   {
//     email: "shiva@cat.gov",
//     password: "password1!",
//     username: "theCat",
//   },
// ];

// const plays = [
//   {
//     title: "The Isle Of Cats",
//     date: new Date("2/28/2023"),
//     isWin: false,
//     score: 20,
//     notes:
//       "The red cats covered almost all the rats but I didnt fill the rooms. womp womp.",
//     UserId: 1,
//   },
//   {
//     title: "Concordia",
//     date: new Date("12/30/2022"),
//     isWin: true,
//     score: 110,
//     notes: "I am the best wine trader in all of the Mediteranan!",
//     UserId: 1,
//   },
// ];

// const seedMe = async () => {
//   await sequelize.sync({ force: true });
//   const seeedUsers = await User.bulkCreate(users, {
//     individualHooks: true,
//   });
//   const seededPlays = await Play.bulkCreate(plays);
//   process.exit(0);
// };

// seedMe();
