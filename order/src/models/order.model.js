const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  pinCode: Number,
  state: String,
  country: String,
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
      price: {
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          enum: ["USD", "INR"],
          default: "INR",
          required: true,
        },
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled", "confirmed"],
    required: true,
  },
  totalAmount: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "INR"],
      default: "INR",
      required: true,
    },
  },
  shippingAddress: [{ type: addressSchema, required: true }],
});

const orderModel = new mongoose.model("order", orderSchema);

module.exports = orderModel;
