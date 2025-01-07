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

    await newProduct.save();

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
  const { name, description, price, userId, image } = req.body;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this product" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    if (image) {
      product.image = image;
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
  const { userId } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);

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
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const products = await Product.find({ seller: userId }).populate(
      "seller",
      "username"
    );
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
