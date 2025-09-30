const productModel = require("../models/product.model");
const uploadImage = require("../services/imagekit.service");

async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency="INR" } = req.body;
  const seller = req.user.id;

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
        id: image.fileId
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
   
    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error });
  }
}

module.exports ={
    createProduct
}