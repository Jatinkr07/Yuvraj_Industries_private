import express from "express";
import {
  createSale,
  getReplacements,
  getSales,
  replaceProduct,
} from "../Controllers/SaleController.js";
import { authenticateSubDealer } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/v1/create", authenticateSubDealer, createSale);
router.get("/v1/sale/list", authenticateSubDealer, getSales);
router.put("/v1/replace/:saleId", authenticateSubDealer, replaceProduct);
router.get("/v1/replacements", authenticateSubDealer, getReplacements);

export default router;
