const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const orderController = require("../controllers/order.controller")

const router = express.Router()

router.post("/",authMiddleware(["user"]), orderController.createOrder)


module.exports = router;