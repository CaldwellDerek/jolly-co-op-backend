const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User,Group,Game,Nomination,Vote} = require("../models");
const jwt = require("jsonwebtoken");

//find all nomination
router.get("/", (req, res) => {
  Nomination.findAll({
    include: [User,Group,Game,Vote],
  })
    .then((allNomination) => {
      res.json(allNomination);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});

module.exports = router;
