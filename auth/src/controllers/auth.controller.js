const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");

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

  const hash = await bcrypt.hash(password, 10);

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

async function userLogin(req, res) {
  const { username, email, password } = req.body;
  const user = await userModel
    .findOne({
      $or: [{ username }, { email }],
    })
    .select("+password");
  if (!user) {
    return res.status(409).json({
      message: "user doesn't exist.",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "password is incorrect.",
    });
  }
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
  return res.status(200).json({
    message: "user logged in successfully.",
  });
}

async function getMyProfile(req, res) {
  return res.status(200).json({
    message: "user gets profile successfully.",
    user: req.user,
  });
}

async function userLogout(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(409).json({
      message: "didn't get token.",
    });
  }
  await redis.set(`blacklist:${token}`, "true");
  res.clearCookie("token");
  res.status(200).json({
    message: "user logged out successfully.",
  });
}

async function getAddresses(req, res) {
  const userId = req.user.id;
  const userAddresses = await userModel.findById(userId).select("addresses");
  if (!userAddresses) {
    return res
      .status(404)
      .json({ message: "No addresses found for this user." });
  }

  res.status(200).json({
    message: "User addresses retrieved successfully.",
    addresses: userAddresses.addresses,
  });
}

async function addAddress(req, res) {
  const id = req.user.id;
  const { street, city, state, pinCode, country } = req.body;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $push: { addresses: { street, city, state, pinCode, country } },
    },
    {
      new: true,
    }
  );
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  return res.status(200).json({
    message: "Address added successfully.",
  });
}

async function deleteAddress(req, res) {
  const userId = req.user.id;
  const { addressId } = req.params;

  const isAddressExist = await userModel.findOne({
    _id: userId,
    "addresses._id": addressId,
  });
  if (!isAddressExist) {
    return res.status(409).json({
      message: "address not found.",
    });
  }
  const user = await userModel.findByIdAndUpdate(
    { _id: userId },
    {
      $pull: { addresses: { _id: addressId } },
    },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({
      message: "user not found.",
    });
  }
  const addressExist = user.addresses.some(
    (addr) => addr._id.toString() == addressId
  );
  if (addressExist) {
    return res.status(500).json({
      message: "Failed to delete the address.",
    });
  }
  res.status(200).json({
    message: "address deleted.",
  });
}

module.exports = {
  userRegister,
  userLogin,
  getMyProfile,
  userLogout,
  getAddresses,
  addAddress,
  deleteAddress,
};
