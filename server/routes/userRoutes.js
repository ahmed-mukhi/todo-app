const express = require("express");
const router = express.Router();

const { registerUser, loginUser, currUser, logOut } = require("../controllers/userController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.post("/currUser", currUser);

module.exports = router;