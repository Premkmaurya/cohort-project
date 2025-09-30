const express = require("express");
const productController = require("../controllers/product.controller");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer")

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});

// POST /api/products/
router.post("/",createAuthMiddleware(["admin","seller"]),upload.array("images",5), productController.createProduct);


module.exports = router;