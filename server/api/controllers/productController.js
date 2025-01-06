import Product from "../models/Product.js";
import User from "../models/User.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "username");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products: ", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  const { name, description, price, userId, image, quantity } = req.body;

  try {
    // Check if the required fields are provided
    if (!name || !description || !price || !image || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      seller: userId,
      quantity,
    });

    // Save the new product
    await newProduct.save();

    // Add product to the user's listing (optional)
    const user = await User.findById(userId);
    user.products.push(newProduct._id);
    await user.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product: ", error);
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, userId, image } = req.body; // Make sure to accept image
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the logged-in user is the seller of the product
    if (product.seller.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this product" });
    }

    // Update the product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    // Update image if provided
    if (image) {
      product.image = image; // Assuming image URL or base64 string is provided
    }

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product: ", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // Assuming the user is authenticated

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the logged-in user is the seller of the product
    if (product.seller.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);

    // Optionally, remove the product from the user's list
    const user = await User.findById(userId);
    user.products.pull(id);
    await user.save();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product: ", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// Get all products contributed by a specific user
export const getUserProducts = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a query parameter

  try {
    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find all products where the seller matches the userId
    const products = await Product.find({ seller: userId }).populate(
      "seller",
      "username"
    );
    // If no products are found, return a message
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this user" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching user products: ", error);
    res
      .status(500)
      .json({ message: "Error fetching user products", error: error.message });
  }
};
