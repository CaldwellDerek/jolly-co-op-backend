const express = require("express");
const router = express.Router();
const { Game, User, Group, Usergroup, Vote } = require("../models");
const jwt = require("jsonwebtoken");
const { afterBulkSync } = require("../models/User");

//find all group
router.get("/", (req, res) => {
  Group.findAll({
    include: [User, Game],
  })
    .then((allGroups) => {
      res.json(allGroups);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});

//find all groups by owner
router.get("/owner", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to find a group!" });
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  Group.findAll({
    where: {
      OwnerId: tokenData.id
    },
    include: [User, Game],
  })
    .then((allGroups) => {
      res.json(allGroups);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});

//find one group
router.get("/:id", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to find a group!" });
  }
  try{
    Group.findByPk(req.params.id, { include: [User, Game, Vote] })
    .then((allGroups) => {
      res.json(allGroups);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      })
    });
  }catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }

});

// create a group and then add in users
router.post("/", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to create a group!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const createGroup = await Group.create(
      {
        name: req.body.name,
        OwnerId: tokenData.id,
      },
      { include: [User, Game] }
    );
    //todo:Assuming the req.body:  bodyOBJ = {userid, userid, userid}
    const usersArray = req.body.users;
    // const usersFound = usersArray.map(async(user)=>{
    //   const workingObj = await User.findByPk(user);
    //   return workingObj
    // })
    // console.log(usersFound)
    // console.log("------------------")
    //  console.log(usersArray)
    await usersArray.push(tokenData.id)
    const addMembers = await createGroup.addUsers(usersArray);
    res.json(addMembers);
  } catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }
});

// edit group PROTECTED to add one or more users
router.post("/add/:groupId", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  const findGroup = await Group.findByPk(req.params.groupId);
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  if (tokenData.id !== parseInt(findGroup.OwnerId)) {
    return res
      .status(403)
      .json({ msg: "You are not the owner of this group" });}
  try {
      const usersArray = req.body.users;
      // const usersFound = usersArray.map(async(user)=>{
      //   const workingObj = await User.findByPk(user);
      //   return workingObj
      // })
      const addMembers = await findGroup.addUsers(usersArray);
      res.json(addMembers);
    }
   catch (err) {
    console.log(err);
    return res.status(403).json({ msg: "invalid token" });
  }
});


// edit group PROTECTED to delete one or more users
router.post("/remove/:groupId", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  const findGroup = await Group.findByPk(req.params.groupId);
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  if (tokenData.id !== parseInt(findGroup.OwnerId)) {
    return res
      .status(403)
      .json({ msg: "You are not the owner of this group" });}
  try {
      const usersArray = req.body.users;
      // const usersFound = usersArray.map(async(user)=>{
      //   const workingObj = await User.findByPk(user);
      //   return workingObj
      // })
      const removeMembers = await findGroup.removeUsers(usersArray);
      res.json(removeMembers);
    }
   catch (err) {
    console.log(err);
    return res.status(403).json({ msg: "invalid token" });
  }
});

// delete one group from a user's group list
router.delete("/leave/:groupid", async(req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to delete a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const foundGroup= await Group.findByPk(req.params.groupid)
    const foundUser = await User.findByPk(tokenData.id)
        if (!foundGroup) {
          return res.status(404).json({ msg: "no such group!" });
        }
        if(foundGroup.OwnerId === tokenData.id){
          const delGroup =  Group.destroy({
            where: {
              id: req.params.groupid
            },
          }) 
          res.status(200).json({msg:"You have delete the group "});
        }else{
          const delGroup =  foundGroup.removeUser(foundUser) 
          res.status(200).json(delGroup).json({msg:"You have leave the group "});
        }
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});

//delete a game from a group
router.delete("/delete/:groupid/:gameid", async(req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to delete a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const foundGroup= await Group.findByPk(req.params.groupid)
    const foundGame = await Game.findByPk(req.params.gameid)
        if (!foundGroup) {
          return res.status(404).json({ msg: "no such group!" });
        }
        if(foundGroup.OwnerId !== tokenData.id){
          res.status(403).json({msg:"You are not the group owner! "});
          }else{
          const delGame =  foundGroup.removeGame(foundGame) 
          res.status(200).json({msg:"You have delete the game! "});
        }
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});



// delete one group PROTECTED
router.delete("/:groupid", async(req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to delete a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const foundGroup= await Group.findByPk(req.params.groupid)
        if (!foundGroup) {
          return res.status(404).json({ msg: "no such group!" });
        }
        if (foundGroup.OwnerId !== tokenData.id) {
          return res
            .status(403)
            .json({ msg: "you can only delete group you created!" });
        }
    const delGroup = await Group.destroy({
          where: {
            id: req.params.groupid
          },
        }) 
    res.json(delGroup);
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});

module.exports = router;
