const paymentModel = require("../models/payment.model");
const axios = require("axios");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPayment(req, res) {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  const { id } = req.params;
  try {
    const orderResponse = await axios.get(
      `http://localhost:3003/api/orders/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const price = orderResponse.data.order.totalAmount;
    const order = await razorpay.orders.create(price);

    const createPayment = new payment.create({
      order: id,
      razorpayId: order.id,
      user: req.user.id,
      price,
    });
    res.status(200).json({
      message: "payment created successfully.",
      createPayment,
    });
  } catch (error) {
    console.log("something has been broken.", err);
    return res.status(500).json({
        message:"Internal server error."
    })
  }
}

async function verifyPayment(req, res) {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  try {
    const {
      validatePaymentVerification,
    } = require("../node_modules/razorpay/dist/utils/razorpay-utils.js");
    const result = validatePaymentVerification(
      {
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
      },
      signature,
      secret
    );

    if(!result){
        return res.status(404).json({
            message:"Invalid signature"
        })
    }

    const payment = await paymentModel.findOne({razorpayId,status:"pending"})

    if(!payment){
        return rs.status(400).json({
            message:"payment not found."
        })
    }

    payment.status = "completed";
    payment.signature = signature;
    payment.paymentId = razorpayPaymentId

    await payment.save()
    res.status(200).json({
        message:"payment successfully completed."
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message:"internal server error"
    })
  }
}

module.exports = {
  createPayment,
  verifyPayment,
};
