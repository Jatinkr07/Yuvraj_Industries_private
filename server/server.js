import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./Config/db.js";
import categoryRoutes from "./Routes/CategoryRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";
import productRoutes from "./Routes/ProductRoutes.js";
import dealerRoutes from "./Routes/DealerRoutes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: "https://yuvraj-industries-v1.netlify.app/",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(join(__dirname, "uploads")));
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dealer", dealerRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
