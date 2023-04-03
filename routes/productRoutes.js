const express = require("express");
const createProductType = require("../controllers/productTypeController");
const createProduct = require("../controllers/productController");
const validateToken = require("../middlewares/validateToken");
const likeController = require("../controllers/likeController");
const productAuth = require("../middlewares/productAuth");
const comment = require("../controllers/commentController");
const getTotal = require("../controllers/getTotal");

const router = express.Router();

router.post("/productType", validateToken, createProductType);
router.post("/createProduct", productAuth, validateToken, createProduct);

router.post("/likeProduct", validateToken, likeController.like);
router.post("/dislikeProduct", validateToken, likeController.disLike);

router.post("/comment", validateToken, comment);
router.post("/mostlikedproduct", validateToken, getTotal.mostLikedProduct);
router.post(
  "/mostdislikedproduct",
  validateToken,
  getTotal.mostDislikedProduct
);

module.exports = router;
