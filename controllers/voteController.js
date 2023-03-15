const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Group, Game, Vote } = require("../models");
const jwt = require("jsonwebtoken");

//find all vote
router.get("/", (req, res) => {
  Vote.findAll({
    include: [User, Group, Game],
  })
    .then((allVote) => {
      res.json(allVote);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});

//get vote within a group
router.get("/group/:groupid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    const getVotes = await Vote.findAll({
      where: { GroupId: req.params.groupid },
    });
    res.json(getVotes);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

//get vote under a user
router.get("/user/:userid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    const getVotes = await Vote.findAll({ where: { UserId: tokenData.id } });
    res.json(getVotes);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

//get vote of a game in a group
router.get("/game/:gameid/group/:groupid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  // const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to see the vote" });
  }
  try {
    const getVotes = await Vote.findAll({
      where: { GroupId: req.params.groupid, Gameid: req.params.gameid },
    });
    res.json(getVotes);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

//get vote under a user in a group
router.get("/group/:groupid/user/:userid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const getVotes = await Vote.findAndCountAll({
      where: { UserId: tokenData.id, GroupId: req.params.groupid },
    });
    res.json(getVotes);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

//count vote of a game under a user in a group
router.get("/:groupid/:userid/:gameid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const getVotes = await Vote.findAndCountAll({
      where: {
        UserId: tokenData.id,
        GroupId: req.params.groupid,
        GameId: req.params.gameid,
      },
    });
    res.json(getVotes);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

//create a vote
router.put("/group/:groupid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    //check if the user has vote in this group
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const usersVote =await Vote.findAll({
      where: { UserId: tokenData.id, GameId:req.body.GameId, GroupId: req.params.groupid },
    });

    console.log(usersVote)
    // if(usersVote){
    //   return res.json()
    // }
    const usersTotalVote = await Vote.findAll({
      where: { UserId: tokenData.id, GroupId: req.params.groupid },
    });
    if (usersTotalVote.length == 2) {
      return res.json({
        msg: "you have used your two votes on anothere game!",
      });
    }
    //check if the users have voted for the same game
    if (usersVote.GameId === req.body.GameId) {
      return res.json({ msg: "you have voted for this game already!" });
    }
    const newVote = await Vote.create({
      UserId: tokenData.id,
      GroupId: req.params.groupid,
      GameId: req.body.GameId,
    });
    res.json(newVote);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

//delete a vote
router.delete("/group/:groupid", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    //TODO:require the request body to have groupid and gameid
    const findVote = await Vote.findOne({
      where: {
        UserId: tokenData.id,
        GroupId: req.params.groupid,
        GameId: req.body.GameId,
      },
    });
    if (findVote.UserId !== tokenData.id) {
      return res
        .status(403)
        .json({ msg: "you can only delete votes you created!" });
    }
    const deleteVote = await Vote.destroy({
      where: {
        UserId: tokenData.id,
        GroupId: req.params.groupid,
        GameId: req.body.GameId,
      },
    });
    res.status(200).json({ msg: "the vote has been deleted" });
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

module.exports = router;
