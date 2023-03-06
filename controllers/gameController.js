const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Group } = require("../models");
const jwt = require("jsonwebtoken");

// create a Game
router.post("/", (req, res) => {
  Game.create({
    name: req.body.name,
    platforms: req.body.platforms,
    rating: req.body.rating,
    genres: req.body.genres
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
