const  ImageKit  = require("Imagekit");
const { v4 : uuidv4 } = require("uuid");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(file) {
  const response = await imagekit.upload({
    file: file,
    fileName: uuidv4(),
    folder: "products",
  });
  return response;
}

module.exports = uploadImage
