const { registerUser, loginUser, currUser, logOut, editUserDetails, verifyCaptcha, genQrCode,verifyQrImage } = require("../controllers/userController");
const express = require("express");
const router = express.Router();


router.post("/verify", verifyCaptcha);
router.get("/getQrImage", genQrCode);
router.get("/verifyQrImage", verifyQrImage);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.post("/currUser", currUser);
router.patch("/edit/:id", editUserDetails);

module.exports = router;