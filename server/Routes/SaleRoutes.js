import express from "express";
import {
  adminReplaceProduct,
  createDealerSale,
  createSale,
  getAllReplacements,
  getAllSales,
  getDealerReplacements,
  getDealerSales,
  getReplacements,
  getSales,
  replaceDealerProduct,
  replaceProduct,
} from "../Controllers/SaleController.js";
import {
  isAuthenticated,
  isDealerAuthenticated,
  isSubDealerAuthenticated,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/v1/create", isSubDealerAuthenticated, createSale);
router.get("/v1/sale/list", isSubDealerAuthenticated, getSales);
router.put("/v1/replace/:saleId", isSubDealerAuthenticated, replaceProduct);
router.get("/v1/replacements", isSubDealerAuthenticated, getReplacements);

router.post("/v1/dealer/create", isDealerAuthenticated, createDealerSale);
router.get("/v1/dealer/sales", isDealerAuthenticated, getDealerSales);
router.put(
  "/v1/dealer/replace/:saleId",
  isDealerAuthenticated,
  replaceDealerProduct
);
router.get(
  "/v1/dealer/replacements",
  isDealerAuthenticated,
  getDealerReplacements
);

router.get("/v1/sales/all", getAllSales);
router.post(
  "/v1/sales/replace/admin/:saleId",
  isAuthenticated,
  adminReplaceProduct
);

router.get("/v1/replacements/all", getAllReplacements);

export default router;
