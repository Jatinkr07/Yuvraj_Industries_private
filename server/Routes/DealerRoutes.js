import express from "express";
import {
  createDealer,
  dealerLogin,
  getDealers,
  deleteDealer,
  updateDealer,
  getDealerProducts,
} from "../Controllers/DealerController.js";
import {
  authenticateSubDealer,
  isAuthenticated,
  isDealerAuthenticated,
} from "../Middleware/authMiddleware.js";

import {
  createSubDealer,
  subDealerLogin,
  getSubDealers,
  updateSubDealer,
  deleteSubDealer,
  getSubDealerProducts,
} from "../Controllers/SubDealerController.js";

const router = express.Router();

router.post("/create", isAuthenticated, createDealer);
router.post("/login", dealerLogin);
router.get("/list", isAuthenticated, getDealers);
router.delete("/:id", isAuthenticated, deleteDealer);
router.put("/:id", isAuthenticated, updateDealer);
router.get("/products", isDealerAuthenticated, getDealerProducts);
router.get("/products/:dealerId", isAuthenticated, getDealerProducts);

//Sub-Dealer
router.post("/subdealer/create", isDealerAuthenticated, createSubDealer);
router.post("/subdealer/login", subDealerLogin);
router.get("/subdealer/subdealers", isDealerAuthenticated, getSubDealers);
router.put("/subdealer/subdealer/:id", isDealerAuthenticated, updateSubDealer);
router.delete(
  "/subdealer/subdealer/:id",
  isDealerAuthenticated,
  deleteSubDealer
);
router.get("/subdealer/products", authenticateSubDealer, getSubDealerProducts);

export default router;
