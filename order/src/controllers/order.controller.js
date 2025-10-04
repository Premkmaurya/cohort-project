const orderModel = require("../models/order.model");
const axios = require("axios");

// create order

async function createOrder(req, res) {
  const user = req.user;
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    const cartResponse = await axios.get("http://localhost:3002/api/cart", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const products = await Promise.all(
      cartResponse.data.cart.items.map(async (item) => {
        return (
          await axios.get(
            `http://localhost:3001/api/products/${item.productId}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          )
        ).data;
      })
    );
    let totalPrice = 0;

    const orderItems = cartResponse.data.cart.items.map((item, idx) => {
      const product = products.find((p) => p.product._id == item.productId);
      if (product.stock < item.quantity) {
        throw new Error(`${product.title} is out of stock.`);
      }
      const total = product.product.price.amount * item.quantity;
      totalPrice += total;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: {
          amount: product.product.price.amount,
          currency: product.product.price.currency,
        },
      };
    });

    const order = await orderModel.create({
      userId: user.id,
      items: orderItems,
      status: "pending",
      totalAmount: {
        amount: totalPrice,
        currency: orderItems[0].price.currency,
      },
      shippingAddress: user.addresses,
    });

    res.status(200).json({
      message: "fetch successfully.",
      order,
    });
  } catch (err) {
    console.log("something has been broken", err);
  }
}

// get order

async function getOrder(req,res){
   const user = req.user;
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  const orders = await orderModel.find({userId:user.id});
  if(!orders){
    return res.status(400).json({
      message:"no order found."
    })
  }
  res.status(200).json({
    message:"orders fetch successfully.",
    orders,
  })
}

module.exports = {
  createOrder,
  getOrder,
};
