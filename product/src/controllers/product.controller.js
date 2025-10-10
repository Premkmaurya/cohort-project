const productModel = require("../models/product.model");
const uploadImage = require("../services/imagekit.service");
const {publishToQueue} = require("../broker/broker")

// create product controller

async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency = "INR" } = req.body;
  const seller = req.user.id;
  const sellerEmail = req.user.email;

  const price = {
    amount: Number(priceAmount),
    currency: priceCurrency,
  };

  const images = await Promise.all(
    req.files.map(async (file) => {
      const image = await uploadImage(file.buffer);
      return {
        url: image.url,
        thumbnail: image.thumbnailUrl,
        id: image.fileId,
      };
    })
  );

  try {
    const newProduct = await productModel.create({
      title,
      description,
      price,
      images,
      seller,
    });

    await Promise.all([
      publishToQueue("SELLER_DASHBOARD_PRODUCT_CREATED",newProduct),
      publishToQueue("PRODUCT_CREATED_NOTIFICATION", { ...newProduct, sellerEmail }),
    ])

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error });
  }
}

// get all products controller

async function getAllProducts(req, res) {
  const { q, minPrice, maxPrice, skip = 0, limit = 20 } = req.query;

  const filter = {};
  if (q) {
    filter.$text = { $search: q };
  }
  if (minPrice) {
    filter["price.amount"] = {
      ...filter["price.amount"],
      $gte: Number(minPrice),
    };
  }
  if (maxPrice) {
    filter["price.amount"] = {
      ...filter["price.amount"],
      $lte: Number(maxPrice),
    };
  }

  try {
    const products = await productModel
      .find(filter)
      .skip(skip)
      .limit(Math.min(Number(limit), 10));
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error });
  }
}

// get one product controller

async function getProductById(req, res) {
  const { id } = req.params;

  const product = await productModel.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.status(200).json({ product: product });
}

// update product controller

async function updateProduct(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await productModel.findById({
    _id: id,
    seller: req.user.id,
  });

  const allowedUpdates = ["title", "description", "price"];
  for (key of Object.keys(req.body)) {
    if (allowedUpdates.includes(key)) {
      if (key === "price" && typeof req.body.price === "object") {
        if (req.body.price.amount !== undefined) {
          product.price.amount = Number(req.body.price.amount);
        }
        if (req.body.price.currency !== undefined) {
          product.price.currency = req.body.price.currency;
        }
      } else {
        product[key] = req.body[key];
      }
    }
  }

  return res
    .status(200)
    .json({ message: "Product updated successfully", product });
}

// delete product controller

async function deleteProduct(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  try {
    await productModel.findOneAndDelete({ _id: id, seller: req.user.id });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error });
  }
}

// get seller's product controller

async function getProductsBySeller(req, res) {
  const id = req.user.id;
  const { skip = 0, limit = 20 } = req.query;


  try {
    const products = await productModel.find({ seller: id })
      .skip(skip)
      .limit(Math.min(Number(limit),20));
    return res.status(200).json({ products: products });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySeller
};
