const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User,Group,Game,Vote} = require("../models");
const jwt = require("jsonwebtoken");

//find all nomination
router.get("/", (req, res) => {
  Vote.findAll({
    include: [User,Group,Game],
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

router.put("/",(req, res)=>{
  Vote.create
})

module.exports = router;
