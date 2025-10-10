const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const sellerController = require("../controllers/seller.controller")
const router = express.Router()

router.get('/metrics',authMiddleware(["seller"]),sellerController.getMetrics)

router.get('/orders',authMiddleware(["seller"]),sellerController.getOrders)

router.get('/products',authMiddleware(["seller"]),sellerController.getProducts)



module.exports = router