const mongoose = require("mongoose");
const {body,validationResult, param} = require("express-validator")


async function responseWithValidationErrors(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    } 
    next();
}

const validateCart = [
    body("productId")
        .isString()
        .withMessage("Product ID must be a string")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid product ID"),
    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    responseWithValidationErrors
]
const validateCartProduct = [
    param("productId")
        .isString()
        .withMessage("Product ID must be a string")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid product ID"),
    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    responseWithValidationErrors
]

module.exports = {
    validateCart,
    validateCartProduct
};