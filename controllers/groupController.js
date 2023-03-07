const express = require("express");
const router = express.Router();
const { Game, User, Group, Usergroup } = require("../models");
const jwt = require("jsonwebtoken");

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

// create a group without members
router.post("/", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to create a group!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Group.create(
      {
        name: req.body.name,
        OwnerId: tokenData.id,
      },
      { include: [User, Game] }
    )
      .then((newGroup) => {
        //todo:Assuming the req.body:  bodyOBJ = {users:[]}
        const userGroup = [];
        const groupMembers = req.body.users.map((member) =>
          userGroup.push({
            GroupId: newGroup.id,
            UserId: member,
          })
        );
        Usergroup.bulkcreate(userGroup)
          .then((addMember) => {
            res.json(addMember);
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

// edit one PROTECTED to add users
router.put("/:groupId", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Usergroup.findByPk(req.params.groupId)
      .then((foundGroup) => {
        Group.update(
          {
            UserId: req.body.UserId,
          },
          {
            where: {
              id: req.params.groupId,
            },
          }
        )
          .then((delPlay) => {
            res.json(delPlay);
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
