import Product from "../Model/Products.js";
import path from "path";
import fs from "fs";
import busboy from "busboy";

const uploadDir = path.join("uploads", "products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const generateUniqueBarcode = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PRD-${timestamp}-${random}`;
};

const handleFileUpload = (req) => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    const fields = {};
    const files = [];

    bb.on("file", (name, file, info) => {
      const filePath = path.join(uploadDir, `${Date.now()}_${info.filename}`);
      const writeStream = fs.createWriteStream(filePath);
      file.pipe(writeStream);

      writeStream.on("finish", () => {
        files.push({
          fieldname: name,
          path: filePath,
          filename: info.filename,
        });
      });
    });

    bb.on("field", (name, val) => {
      fields[name] = val;
    });

    bb.on("finish", () => {
      resolve({ fields, files });
    });

    bb.on("error", (err) => {
      reject(err);
    });

    req.pipe(bb);
  });
};

export const createProduct = async (req, res) => {
  try {
    const { fields, files } = await handleFileUpload(req);
    const { serialNumber } = fields;

    const existingProduct = await Product.findOne({ serialNumber });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this serial number already exists" });
    }

    const images = files.map((file) => file.path);
    const qty = parseInt(fields.quantity) || 1;
    const products = [];

    const baseProduct = {
      productName: fields.productName,
      category: fields.category,
      power: fields.power,
      stage: fields.stage,
      maxDischarge: fields.maxDischarge,
      maxHead: fields.maxHead,
      warranty: fields.warranty,
      pipeSize: fields.pipeSize,
      description: fields.description,
      images,
      addedOn: new Date(),
      assignedTo: null,
      isAssigned: false,
    };

    for (let i = 0; i < qty; i++) {
      products.push({
        ...baseProduct,
        serialNumber: `${serialNumber}-${(i + 1).toString().padStart(3, "0")}`,
        barcode: generateUniqueBarcode(),
        quantity: 1,
      });
    }

    const savedProducts = await Product.insertMany(products);
    res.status(201).json({
      message: `Successfully created ${qty} products`,
      products: savedProducts,
    });
  } catch (error) {
    console.error("Error creating products:", error);
    res
      .status(500)
      .json({ message: "Failed to create products", error: error.message });
  }
};

// ProductController.js
export const assignProductToDealer = async (req, res) => {
  try {
    const { code } = req.body;
    const dealerId = req.dealerId;

    console.log("Received code for assignment:", code);
    console.log("Dealer ID:", dealerId);

    // Search by exact match or base serial number with suffix
    const product = await Product.findOne({
      $or: [
        { barcode: code },
        { serialNumber: code },
        { serialNumber: { $regex: new RegExp(`^${code}-\\d{3}$`) } }, // Match TEST-001-XXX
      ],
    });

    console.log("Found product:", product || "None");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.isAssigned) {
      return res.status(400).json({ message: "Product already assigned" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      { assignedTo: dealerId, isAssigned: true, assignedAt: new Date() },
      { new: true }
    ).populate("category", "name");

    res.status(200).json({
      message: "Product assigned successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error assigning product:", error);
    res
      .status(500)
      .json({ message: "Failed to assign product", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { productName: { $regex: search, $options: "i" } },
            { serialNumber: { $regex: search, $options: "i" } },
            { barcode: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .sort({ addedOn: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields, files } = await handleFileUpload(req);
    const updateData = { ...fields };

    if (files.length > 0) {
      const product = await Product.findById(id);
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          fs.unlinkSync(image);
        }
      }
      updateData.images = files.map((file) => file.path);
    } else if (fields.deleteImage) {
      const product = await Product.findById(id);
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          fs.unlinkSync(image);
        }
      }
      updateData.images = [];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name");
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        fs.unlinkSync(image);
      }
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
