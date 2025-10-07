const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const search_products = tool(
  async ({ input, token }) => {
    try {
      const productResponse = await axios.get(
        `http://localhost:3001/api/products?q=${input}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return JSON.stringify(productResponse.data);
    } catch (error) {
      // Added error handling for search
      return `Error searching products: ${error.message}`;
    }
  },
  {
    name: "search_products",
    description: "search products based on query.",
    schema: z.object({
      input: z.string().describe("prefreance based search product."),
    }),
  }
);

const add_to_cart = tool(
  async ({ productId, quantity, token }) => {
    if (!productId || typeof quantity !== "number" || quantity < 1) {
      return "Error: Tool was called with missing or invalid arguments (productId or quantity). Advise the user to provide a product ID and quantity.";
    }

    try {
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
      return JSON.stringify(cartResponse.data);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        return `Error adding to cart (Status ${
          error.response.status
        }): The Cart service rejected the request. Validation errors: ${JSON.stringify(
          errors
        )}`;
      }
      return `An unexpected error occurred: ${error.message}`;
    }
  },
  {
    name: "add_to_cart",
    description: "add product to the cart.",
    schema: z.object({
      productId: z.string().describe("product id which add to the cart."),
      quantity: z.number().describe("product quantity number to add cart."),
    }),
  }
);

const clear_cart = tool(
  async ({ token }) => {
    try {
      const response = await axios.delete("http://localhost:3002/api/cart", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return JSON.stringify(response.data);
    } catch (err) {
      return new Error("cart not found.");
    }
  },
  {
    name: "clear_cart",
    description: "clear all the product from the cart.",
  }
);

module.exports = { add_to_cart, search_products, clear_cart };
