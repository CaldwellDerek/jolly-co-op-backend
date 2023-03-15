const express = require('express');
const router = express.Router();

const userRoutes = require("./userController")
router.use("/api/users",userRoutes)

const groupRoutes = require("./groupController")
router.use("/api/groups",groupRoutes)

const gameRoutes = require("./gameController")
router.use("/api/games",gameRoutes)

const voteRoutes = require("./voteController")
router.use("/api/votes",voteRoutes)

const nodemailerRoutes = require("./nodemailerController");
router.use("/email", nodemailerRoutes);


module.exports = router;