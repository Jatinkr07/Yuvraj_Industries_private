// backend/routes/dealerRoutes.js
import express from "express";
import {
  createDealer,
  dealerLogin,
  getDealers,
  deleteDealer,
} from "../Controllers/DealerController.js";
import {
  isAuthenticated,
  isDealerAuthenticated,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createDealer);
router.post("/login", dealerLogin);
router.get("/list", isDealerAuthenticated, getDealers);
router.delete("/:id", isAuthenticated, deleteDealer);

export default router;
