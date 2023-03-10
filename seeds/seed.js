const sequelize = require("../config/connection");
const { User, Group, Game } = require("../models");

const users = [
  {
    email: "yanqinglou@outlook.com",
    password: "password",
    username: "yanqing",
  },
  {
    email: "lily@lily.gmail",
    password: "password",
    username: "password",
  },
  {
    email: "amy@amy.gmail",
    password: "password",
    username: "amy",
  },
  {
    email: "jody@jody.gmail",
    password: "password",
    username: "jody",
  },
  {
    email: "emma@emma.gmail",
    password: "password",
    username: "emma",
  },
];

const groups = [
  {
    name: "1st jolly group",
    OwnerId: 1,
    
  },
  {
    name: "2nd best group",
    OwnerId: 2,
  },
  {
    name: "3nd funniest group",
    OwnerId: 3,
  },
];

const games = [
  {
    name: "Super Mario",
    platforms: "Nitendo PC Playstation",
    rating:4,
    genres:"action",
    imgURL: " https://place-puppy.com/300x300"
  },
  {
    name: "Sims4",
    platforms: "PC Playstation",
    rating:4,
    genres:"family",
    imgURL: "http://plhttps://media.rawg.io/media/games/71d/71df9e759b2246f9769126c98ac997fc.jpgacekitten.com/200/300"
  },
  {
    name: "League of the Legend",
    platforms: "PC Playstation",
    rating:5,
    genres:"war action",
    imgURL: "http://placekitten.com/200/300"
  }
];

const seedMe = async () => {
  await sequelize.sync({ force: true });
  const seeedUsers = await User.bulkCreate(users, {
    individualHooks: true,
  });
  const seededPlays = await Group.bulkCreate(groups);
  const seededgGames = await Game.bulkCreate(games);
  process.exit(0);
};

seedMe();
