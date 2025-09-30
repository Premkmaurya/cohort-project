const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authUserMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
    if (!token) {
    return res.status(401).json({ message: "login first." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = decoded;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  authUserMiddleware,
};
