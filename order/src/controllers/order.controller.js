const orderModel = require("../models/order.model");
const axios = require("axios");
const {publishToQueue} = require("../broker/broker")


// create order
async function createOrder(req, res) {
  const user = req.user;
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  const {street,city,pinCode,country,state} = req.body;
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
      const productResponse = products.find((p) => p.product._id == item.productId);
      if (productResponse.stock < item.quantity && !productResponse) {
        throw new Error(`${productResponse.title} is out of stock.`);
      }
      const total = productResponse.product.price.amount * item.quantity;
      totalPrice += total;
      return {
        productId: item.productId, 
        quantity: item.quantity,
        price: {
          amount: productResponse.product.price.amount,
          currency: productResponse.product.price.currency,
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
      shippingAddress: {
        street,
        city,
        pinCode,
        state,
        country,
      },
    });

    await publishToQueue("SELLER_DASHBOARD_ORDER_CREATED",order);

    res.status(200).json({
      message: "fetch successfully.",
      order,
    });
  } catch (err) {
    console.log("something has been broken", err);
  }
}

// get orders
async function getOrder(req, res) {
  const user = req.user;
  const { skip=0, limit = 10 } = req.body;

  const orders = await orderModel
    .find({ userId: user.id })
    .skip(skip)
    .limit(Math.min(Number(limit), 10));
  if (!orders) {
    return res.status(400).json({
      message: "no order found.",
    });
  }
  res.status(200).json({
    message: "orders fetch successfully.",
    orders,
  });
}

// get order by id
async function getOrderById(req, res) {
  const { id } = req.params;
  const user = req.user;
  const order = await orderModel.findOne({ _id: id, userId: user.id });
  if (!order) {
    return res.status(400).json({
      message: "no order found.",
    });
  }
  res.status(200).json({
    message: "order fetch successfully.",
    order,
  });
}

// cancel order by id
async function cancelOrderById(req,res){
  const {id} = req.params;
  const user = req.user;

  const order = await orderModel.findOne({_id:id,userId:user.id});

  if(!order){
    return res.status(400).json({
      message:"no order found with this id."
    })
  }

  order.status = "cancelled";
  await order.save();
  res.status(200).json({
    message:"order cancelled successfully.",
    order,
  })
}

// update order address
async function updateOrderAddress(req,res){
  const {id} = req.params;
  const user = req.user;
  const {street,city,pinCode,state,country}= req.body;
  const order = await orderModel.findOne({_id:id,userId:user.id});

  if(!order){
    return res.status(403).json({
      message:"no order found by this id."
    })
  }

  if(order.status === "delivered" || order.status === "cancelled"){
    return res.status(400).json({
      message:`you can't update address for ${order.status} order.`
    })
  }
  order.shippingAddress[0] = {
    street:street!==undefined? street : order.shippingAddress[0].street,
    city:city!==undefined? city : order.shippingAddress[0].city,
    pinCode:pinCode!==undefined? pinCode : order.shippingAddress[0].pinCode,
    state:state!==undefined? state : order.shippingAddress[0].state,
    country:country!==undefined? country : order.shippingAddress[0].country
  }
  await order.save();
  res.status(200).json({
    message:"order address updated successfully.",
    order,
  })
}

module.exports = {
  createOrder,
  getOrder,
  getOrderById,
  cancelOrderById,
  updateOrderAddress
};
