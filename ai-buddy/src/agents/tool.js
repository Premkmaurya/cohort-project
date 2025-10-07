const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const search_products = tool(
  async ({ query, token }) => {
    const productResponse = axios.get(
      `http://localhost:3001/api/products?q=${query}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return JSON.stringify(productResponse.data);
  },
  {
    name: "search_products",
    description: "search products based on query.",
    inputSchema: z.object({
      query: z.string().describe("prefreance based search product."),
    }),
  }
);

const add_to_cart = tool(
  async ({ productId, quantity, token }) => {
    const cartResponse = await axios.post(
      "http://localhost:3002/api/cart/items",
      {
        productId,
        quantity,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  },
  {
    name: "add_to_cart",
    description: "add product to the cart.",
    inputSchema: z.object({
      productId: z.string().describe("product id which add to the cart."),
      quantity: z.number().describe("product quantity number to add cart."),
    }),
  }
);


module.exports = {add_to_cart,search_products}