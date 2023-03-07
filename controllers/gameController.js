const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Group, Game } = require("../models");
const jwt = require("jsonwebtoken");

//find all games
router.get("/", (req, res) => {
  Game.findAll({
    include: [User, Group],
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

// create a Game and add into user's list
router.put("/", async(req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to create a group!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const gameSearch = await Game.findOne({where:{name:req.body.name}})
    const newUser = await User.findByPk(tokenData.id)
    //*find game in the current game table. if the game exists, add user to the game; if not, create a new game
    if (gameSearch){
      const addGametoUser = await gameSearch.addUser(newUser)
      res.json(addGametoUser)
    }else {
      const newGame = await Game.create({
        name: req.body.name,
        platforms: req.body.platforms,
        rating: req.body.rating,
        genres: req.body.genres,
      })
      //* only add userid here, game is not in any group
      const newUserGame = await newGame.addUser(newUser)
      res.json(newUserGame)
    }

  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});

// get one with gameid
router.get("/:id", (req, res) => {
  Game.findByPk(req.params.id, {})
    .then((gameData) => {
      res.json(gameData);
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "oh no", err });
    });
});

//add game to a group
router.put("/:gameid/:groupid", async(req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const foundGroup = await  Group.findByPk(req.params.groupid)
    const foundGame = await Game.findByPk(req.params.gameid)
    const addGame = await foundGroup.addGame(foundGame)
    res.json(addGame)
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
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
    Game.findByPk(req.params.id)
      .then((foundGame) => {
        if (!foundGame) {
          return res.status(404).json({ msg: "no such play!" });
        }
        if (foundGame.UserId !== tokenData.id) {
          return res
            .status(403)
            .json({ msg: "you can only delete plays you created!" });
        }
        Game.destroy({
          where: {
            id: req.params.id,
          },
        })
          .then((delGame) => {
            res.json(delGame);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "womp womp womp",
              err,
            });
          });
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
