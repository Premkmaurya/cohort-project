const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const orderController = require("../controllers/order.controller")
const addressValidations = require("../middlewares/validation.middleware")

const router = express.Router()

// POST /api/orders create order
router.post("/",authMiddleware(["user"]),addressValidations, orderController.createOrder)

// GET /api/orders get order
router.get('/',authMiddleware(["user"]),orderController.getOrder)

// POST /api/orders/:id cancel order by id
router.post("/:id/cancel", authMiddleware(["user"]), orderController.cancelOrderById)

// POST update order address by id
router.post("/:id/address", authMiddleware(["user"]), orderController.updateOrderAddress)

// GET /api/orders/:id get order by id
router.get("/:id", authMiddleware(["user"]), orderController.getOrderById);


module.exports = router;