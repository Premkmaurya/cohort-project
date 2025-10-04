const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const cartController = require('../controllers/cart.controller');
const router = express.Router();

// POST /api/cart
router.post('/items',authMiddleware(["user"]),validationMiddleware.validateCart,cartController.addToCart)

// GET /api/cart
router.get('/',authMiddleware(["user"]),cartController.getCart)

//PATCH /api/cart/item/:productId
router.patch('/items/:productId',authMiddleware(["user"]),validationMiddleware.validateCartProduct,cartController.updateCartItem)

// DELETE /api/cart/item/:productId
router.delete('/items/:productId',authMiddleware(["user"]),cartController.removeCartItem)

// DELETE /api/cart
router.delete('/',authMiddleware(["user"]),cartController.clearCart)

module.exports = router;