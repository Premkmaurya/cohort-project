const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const validationMiddleware = require('../middlewares/validator.middleware')


// POST /api/auth/register
router.post('/register',validationMiddleware.registerUserValidations,authController.userRegister)

// POST /api/auth/login
router.post('/login',validationMiddleware.loginUserValidations,authController.userLogin)

// GET /api/auth/me
router.get('/me',authMiddleware.authUserMiddleware,authController.getMyProfile)

// GET /api/auth/logout
router.get('/logout',authController.userLogout)

// GET /api/auth/me/addresses
router.get('/me/addresses', authMiddleware.authUserMiddleware, authController.getAddresses);

// POST /api/auth/me/addresses
router.post("/me/addresses",authMiddleware.authUserMiddleware,validationMiddleware.addressValidations,authController.addAddress)

// DELETE /api/auth/me/addresses/:addressId
router.delete("/me/addresses/:addressId",authMiddleware.authUserMiddleware,authController.deleteAddress)

module.exports = router