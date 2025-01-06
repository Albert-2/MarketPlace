import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getUserProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/userproducts/:userId", getUserProducts);

export default router;
