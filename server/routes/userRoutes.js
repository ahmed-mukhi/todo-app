const { registerUser, loginUser, currUser, logOut, editUserDetails } = require("../controllers/userController");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads");
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
//     fileFilter: (req, file, cb) => {
//         if (file) {
//             cb(null, true);
//         } else {
//             cb(null, false);
//         }
//     },
// });

// const upload = multer({ storage: storage }).single("profileImage");


router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.post("/currUser", currUser);
router.patch("/edit/:id", editUserDetails);

module.exports = router;