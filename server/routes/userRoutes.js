const express = require("express");
const router = express.Router();

const { registerUser, loginUser, currUser } = require("../controllers/userController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/currUser", currUser);

module.exports = router;