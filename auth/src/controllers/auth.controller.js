const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function userRegister(req, res) {
  const {
    username,
    email,
    password,
    fullName: { firstName, lastName },
    role,
    address,
  } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    return res.status(401).json({
      message: "user already exist,please login.",
    });
  }

  const hash = await bcrypt.hash(password,10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
    fullName: { firstName, lastName },
    role,
    address,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
    process.env.JWT_SECRET_KEY
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "user created successfully.",
  });
}

module.exports = {
  userRegister,
};
