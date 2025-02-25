import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  assignProductToDealer,
} from "../Controllers/ProductController.js";
import { isDealerAuthenticated } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/assign", isDealerAuthenticated, assignProductToDealer);

export default router;
