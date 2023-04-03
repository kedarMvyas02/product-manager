const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const validateToken = require("../middlewares/validateToken");
const common = require("../middlewares/commonMiddleware");

const router = express.Router();

router.post("/signup", auth, userController.signUp);
router.post("/signin", userController.signIn);
router.delete("/delete", common, validateToken, userController.deleteUser);
router.post(
  "/forgotPassword",
  common,
  validateToken,
  userController.forgotPassword
);
router.patch(
  "/resetPassword/:token",
  validateToken,
  userController.resetpassword
);

module.exports = router;
