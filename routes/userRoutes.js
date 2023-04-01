const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const validateToken = require("../middlewares/validateToken");
const loggedIn = require("../middlewares/loggedIn");
const common = require("../middlewares/commonMiddleware");

const router = express.Router();

router.post("/signup", auth, userController.signUp);
router.post("/signin", loggedIn, userController.signIn);
router.delete("/delete", common, validateToken, userController.deleteUser);
router.post(
  "/forgotPassword",
  common,
  validateToken,
  userController.forgotPassword
);
router.post("/resetPassword", validateToken, userController.resetpassword);

module.exports = router;
