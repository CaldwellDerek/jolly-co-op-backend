const express = require("express");
const router = express.Router();
const { Game, User } = require("../models");
const jwt = require("jsonwebtoken");

//find all group
router.get("/", (req, res) => {
  Group.findAll({
    include: [User],
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
  Group.findByPk({
    include: [User,Game],
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

// create a group
router.post("/", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ msg: "you must be logged in to create a group!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Group.create({
      name: req.body.name,
      OwnerId:tokenData.id
    })
      .then((newGroup) => {
        res.json(newGroup);
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

// // edit one PROTECTED
// router.put("/:groupId", (req, res) => {
//   const token = req.headers?.authorization?.split(" ")[1];
//   if (!token) {
//     return res
//       .status(403)
//       .json({ msg: "you must be logged in to edit a play!" });
//   }
//   try {
//     const tokenData = jwt.verify(token, process.env.JWT_SECRET);
//     Group.findByPk(req.params.groupId)
//       .then((foundGroup) => {
//         Group.update(
//           {
// name:
//           } 
//         )
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

// delete one PROTECTED
router.delete("/:playId", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to delete a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Play.findByPk(req.params.playId)
      .then((foundPlay) => {
        if (!foundPlay) {
          return res.status(404).json({ msg: "no such play!" });
        }
        if (foundPlay.UserId !== tokenData.id) {
          return res
            .status(403)
            .json({ msg: "you can only delete plays you created!" });
        }
        Play.destroy({
          where: {
            id: req.params.playId,
          },
        })
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

module.exports = router;
