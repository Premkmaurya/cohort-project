const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()
const validationMiddleware = require('../middlewares/validator.middleware')

router.post('/register',validationMiddleware.registerUserValidations,authController.userRegister)
router.post('/login',validationMiddleware.loginUserValidations,authController.userLogin)

module.exports = router