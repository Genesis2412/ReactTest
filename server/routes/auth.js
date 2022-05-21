const express = require("express");

const {
  register,
  login,
  passwordHash,
  deleteUser,
} = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reauthenticate", passwordHash);
router.post("/deleteUser", deleteUser);

module.exports = router;
