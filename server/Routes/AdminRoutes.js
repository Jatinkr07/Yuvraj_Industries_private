import express from "express";
import {
  adminLogin,
  adminLogout,
  adminProtected,
} from "../Controllers/AdminController.js";
import { isAuthenticated } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/protected", isAuthenticated, adminProtected);

export default router;
