const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const todoRoutes = require("./todosRouter");

router.use("/todo", todoRoutes);
router.use("/user", userRoutes);

module.exports = router;
