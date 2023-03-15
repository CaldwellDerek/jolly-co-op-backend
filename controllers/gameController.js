const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Group, Game, Usergame, Vote } = require("../models");
const jwt = require("jsonwebtoken");

//find all games
router.get("/", (req, res) => {
  Game.findAll({
    include: [User, Group, Vote],
  })
    .then((allGames) => {
      res.json(allGames);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});

// get one with gameid
router.get("/:id", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  Game.findByPk(req.params.id, {include:[Vote]})
    .then((gameData) => {
      res.json(gameData);
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "oh no", err });
    });
});

// add/create a Game into user's list
router.put("/", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to create a group!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const gameSearch = await Game.findOne({ where: { name: req.body.name } });
    const newUser = await User.findByPk(tokenData.id);
    //*find game in the current game table. if the game exists, add user to the game; if not, create a new game
    if (gameSearch) {
      const addGametoUser = await gameSearch.addUser(newUser);
      res.json(addGametoUser);
    } else {
      const newGame = await Game.create({
        name: req.body.name,
        platforms: req.body.platforms,
        rating: req.body.rating,
        genres: req.body.genres,
        imgURL: req.body.imgURL
      });
      //* only add userid here, game is not in any group
      const newUserGame = await newGame.addUser(newUser);
      res.json(newUserGame);
    }
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});

//add game to a group
router.put("/:gameid/:groupid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const foundGroup = await Group.findByPk(req.params.groupid,{include:[User,Game]});
    const foundGame = await Game.findByPk(req.params.gameid);
    // if(foundGroup.Users.includes()){
    //   return res.status(403).json({msg:'you are not a member of this group'})
    // }
    // if(foundGroup.Games.includes(req.params.gameid)){
    //   return res.json({msg:'This game has been added to the group'})
    // }
    const addGame = await foundGroup.addGame(foundGame);
    res.json(addGame);
  } catch (err) {
    return res.json(err);
  }
});

// delete one PROTECTED
router.delete("/:id", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to delete a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Game.findByPk(req.params.id, {
      include: [User]
    })
      .then((foundGame) => {
        if (!foundGame) {
          return res.status(404).json({ msg: "no such play!" });
        }
        for (let user of foundGame.Users){
          if (user.id === tokenData.id){
            Usergame.destroy({
              where: {
                UserId: user.id,
                GameId: req.params.id
              }
            }).then(delGame => {
              res.json(delGame);
            }).catch(err => {
              res.status(500).json({
                msg: "womp womp womp",
                err
              })
            })
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          msg: "womp womp womp",
          err,
        });
      });
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});

module.exports = router;
