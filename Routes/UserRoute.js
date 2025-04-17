const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userAccountUpdate,
  userAccountDetails,
} = require("../Controllers/UserController");
// const authMiddleware = require("../Middlewares/authMiddleware");

// all the below is for residence
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/useraccountdetails/:id", userAccountDetails);
router.patch("/updateaccount/:id", userAccountUpdate);

module.exports = router;
