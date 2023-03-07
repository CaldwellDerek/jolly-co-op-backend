const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Group, Game } = require("../models");
const jwt = require("jsonwebtoken");

// create a Game
router.post("/", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ msg: "you must be logged in to create a group!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  Game.create({
    name: req.body.name,
    platforms: req.body.platforms,
    rating: req.body.rating,
    genres: req.body.genres,
    UserId: tokenData.id
  })
    .then((newGame) => {
      res.json({
        game: newGame,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "oh no", err });
    });
  }  catch(err) {   
  return res.status(403).json({ msg: "invalid token" });
}
});

// get one with gameid
router.get("/:id", (req, res) => {
  Game.findByPk(req.params.id, {
  })
    .then((gameData) => {
      res.json(gameData);
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "oh no", err });
    });
});

module.exports = router;
