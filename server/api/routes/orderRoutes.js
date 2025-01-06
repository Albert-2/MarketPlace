import express from "express";
import {
  placeOrder,
  getUserOrders,
  markOrderAsDelivered,
  withdrawOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder);
router.post("/delivered", markOrderAsDelivered);
router.get("/user/:userId", getUserOrders);
router.post("/delete", withdrawOrder);

export default router;
