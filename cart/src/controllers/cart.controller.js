const cartModel = require("../models/cart.model");

// add product to cart

async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  const user = req.user;

  const cart = await cartModel.findOne({ userId: user.id });
  if (!cart) {
    const createCart = new cartModel({
      userId: user.id,
      items: [],
    });
  }
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  res.status(200).json(cart);
}

// get cart products

async function getCart(req, res) {
  const user = req.user;

  const cart = await cartModel.findOne({ userId: user.id });
  if (!cart) {
    const createCart = new cartModel({
      userId: user.id,
      items: [],
    });
    await createCart.save();
  }
  return res.status(200).json({
    cart,
    totalItems: cart.items.length,
    totalQuantity: cart.items.reduce((acc, item) => acc + item.quantity, 0),
  });
}

// update cart item quantity

async function updateCartItem(req, res) {
  const { productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;

  const cart = await cartModel.findOne({ userId: user.id });
  if (!cart) {
    return res.status(404).json({ message: "Cart is empty" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex < 0) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  return res.status(200).json({
    message: "Cart updated successfully",
    cart,
  });
}

// remove cart item

async function removeCartItem(req, res) {
  const { productId } = req.params;
  const user = req.user;

  const cart = await cartModel.findOne({ userId: user.id });
  if (!cart) {
    return res.status.json({
      message: "cart is empty.",
    });
  }

  const product = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  cart.items.splice(product, 1);
  await cart.save();
  return res.status(200).json({
    message: "Item removed from cart",
    cart,
  });
}

// remove all item in the cart

async function clearCart(req, res) {
    const user = req.user;

    const cart = await cartModel.findOne({userId:user.id})
    if(!cart){
        return res.status(404).json({
            message:"cart resource not found."
        })
    }
    if(cart.items.length === 0){
        return res.status(400).json({
            message:"cart is already empty."
        })
    }
    cart.items = []
    await cart.save()
    return res.status(200).json({
        message:"remove all the cart items.",
    })

}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
