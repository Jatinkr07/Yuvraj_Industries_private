// backend/routes/dealerRoutes.js
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
  isAuthenticated,
  isDealerAuthenticated,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createDealer);
router.post("/login", dealerLogin);
router.get("/list", isAuthenticated, getDealers);
router.delete("/:id", isAuthenticated, deleteDealer);
router.put("/:id", isAuthenticated, updateDealer);
router.get("/products", isDealerAuthenticated, getDealerProducts);

export default router;
