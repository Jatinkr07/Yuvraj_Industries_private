import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  assignProductToSubDealer,
  dealerManualAssignProduct,
  assignProductToDealer,
  bulkAssignProductsToDealer,
} from "../Controllers/ProductController.js";
import {
  authenticateSubDealer,
  isDealerAuthenticated,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/assign", isDealerAuthenticated, assignProductToDealer);
router.post(
  "/subdealer/assign-product",
  authenticateSubDealer,
  assignProductToSubDealer
);
router.post(
  "/dealer/manual-assign",
  isDealerAuthenticated,
  dealerManualAssignProduct
);
router.post(
  "/bulk-assign-to-dealer",
  isDealerAuthenticated,
  bulkAssignProductsToDealer
);

export default router;
