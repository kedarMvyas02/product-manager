const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const validateToken = require("../middlewares/validateToken");
const common = require("../middlewares/commonMiddleware");
const followUnfollowUser = require("../controllers/followUnfollowUser");

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

router.post("/followuser", validateToken, followUnfollowUser.followUser);
router.post("/unfollowuser", validateToken, followUnfollowUser.unFollowUser);
router.get("/mostFollowers", validateToken, followUnfollowUser.mostFollowers);

module.exports = router;
