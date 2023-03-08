const express = require("express");
const router = express.Router();
const { Game, User, Group, Usergroup } = require("../models");
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

//find one group
router.get("/:id", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to create a group!" });
  }
  Group.findByPk(req.params.id, { include: [User, Game] })
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
    const groupOwner = await User.findByPk(tokenData.id);
    const usersArray = await JSON.parse(req.body.users);
    const usersFound = usersArray.map(async(user)=>{
      const workingObj = await User.findByPk(user);
      return workingObj
    })
    const addMembers = await createGroup.addUsers(usersArray);
    res.json(addMembers);
    //  const groupMembers= usersArray.map(member => {
    //      return ({
    //       GroupId: newGroup.id,
    //       UserId: member
    //     });
    //   });

    //   console.log(groupMembers)
    //   const addMember = Usergroup.bulkCreate(groupMembers)
  } catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }
});

// edit one PROTECTED to add users
router.put("/:groupId", async (req, res) => {
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
      const usersArray = await JSON.parse(req.body.users);
      const usersFound = usersArray.map(async(user)=>{
        const workingObj = await User.findByPk(user);
        return workingObj
      })
      const addMembers = await findGroup.addUsers(usersArray);
      res.json(addMembers);
    }

    // let workingArray = [];
    // usersArray.forEach(async (item) => {
    //   let workingObj = await User.findByPk(item);
    //   workingArray.push(workingObj);
    // });
    // const addMembers = await findGroup.addUser(workingArray);

    // Usergroup.findByPk(req.params.groupId)
    //   .then((foundGroup) => {
    //     Group.update(
    //       {
    //         UserId: req.body.UserId,
    //       },
    //       {
    //         where: {
    //           id: req.params.groupId,
    //         },
    //       }
    //     )
    //       .then((delPlay) => {
    //         res.json(delPlay);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         res.status(500).json({
    //           msg: "womp womp womp",
    //           err,
    //         });
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).json({
    //       msg: "womp womp womp",
    //       err,
    //     });
    //   });
   catch (err) {
    console.log(err);
    return res.status(403).json({ msg: "invalid token" });
  }
});

// // delete one PROTECTED
// router.delete("/:playId", (req, res) => {
//   const token = req.headers?.authorization?.split(" ")[1];
//   if (!token) {
//     return res
//       .status(403)
//       .json({ msg: "you must be logged in to delete a play!" });
//   }
//   try {
//     const tokenData = jwt.verify(token, process.env.JWT_SECRET);
//     Play.findByPk(req.params.playId)
//       .then((foundPlay) => {
//         if (!foundPlay) {
//           return res.status(404).json({ msg: "no such play!" });
//         }
//         if (foundPlay.UserId !== tokenData.id) {
//           return res
//             .status(403)
//             .json({ msg: "you can only delete plays you created!" });
//         }
//         Play.destroy({
//           where: {
//             id: req.params.playId,
//           },
//         })
//           .then((delPlay) => {
//             res.json(delPlay);
//           })
//           .catch((err) => {
//             console.log(err);
//             res.status(500).json({
//               msg: "womp womp womp",
//               err,
//             });
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json({
//           msg: "womp womp womp",
//           err,
//         });
//       });
//   } catch (err) {
//     return res.status(403).json({ msg: "invalid token" });
//   }
// });

module.exports = router;
