import express from "express";
import {
  createDealerSale,
  createSale,
  getDealerReplacements,
  getDealerSales,
  getReplacements,
  getSales,
  replaceDealerProduct,
  replaceProduct,
} from "../Controllers/SaleController.js";
import {
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

export default router;
