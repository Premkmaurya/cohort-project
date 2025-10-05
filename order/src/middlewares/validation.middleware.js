const {body,validationResult} = require('express-validator')

const responseMiddlewareErrors = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const addressValidations = [
    body("street")
    .notEmpty()
    .withMessage("Street is required."),
    body("city")
    .notEmpty()
    .withMessage("City is required."),
    body("pinCode")
    .notEmpty()
    .withMessage("Pin code is required."),
    body("state")
    .notEmpty()
    .withMessage("State is required."),
    body("country")
    .notEmpty()
    .withMessage("Country is required."),
]

module.exports = addressValidations;