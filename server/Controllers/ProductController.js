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
console.log("PRD- barcode", generateUniqueBarcode());

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
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
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

export const assignProductToDealer = async (req, res) => {
  try {
    const { code } = req.body;
    const dealerId = req.dealerId;

    console.log("[Backend] Received code for assignment:", code);
    console.log("[Backend] Dealer ID:", dealerId);

    if (!code) {
      console.log("[Backend] Error: No code provided");
      return res
        .status(400)
        .json({ message: "No barcode or serial number provided" });
    }

    let product = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
    });

    console.log("[Backend] Found product:", product ? product : "None");

    if (!product) {
      console.log("[Backend] Product not found for code:", code);
      return res.status(404).json({
        message:
          "Product not found. Ensure the barcode or serial number exists.",
      });
    }

    if (product.isAssigned) {
      console.log("[Backend] Product already assigned:", product._id);
      return res.status(400).json({ message: "Product already assigned" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      { assignedTo: dealerId, isAssigned: true, assignedAt: new Date() },
      { new: true }
    ).populate("category", "name");

    console.log("[Backend] Product assigned successfully:", updatedProduct);

    res.status(200).json({
      message: "Product assigned successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("[Backend] Error assigning product:", error.message);
    res.status(500).json({
      message: "Failed to assign product",
      error: error.message,
    });
  }
};

export const assignProductToSubDealer = async (req, res) => {
  try {
    const { code } = req.body;
    const subDealerId = req.subDealerId;
    const dealerId = req.dealerId;

    console.log("Assigning to SubDealer - Code:", code);
    console.log("SubDealer ID:", subDealerId);
    console.log("Dealer ID:", dealerId);

    if (!code) {
      return res
        .status(400)
        .json({ message: "No barcode or serial number provided" });
    }

    // Log all products with this code for debugging
    const allProducts = await Product.find({
      $or: [{ barcode: code }, { serialNumber: code }],
    });
    console.log("All products with code:", allProducts);

    let product = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      assignedTo: dealerId,
      isAssigned: true,
    });

    console.log("Found Product with conditions:", product || "None");

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found or not assigned to your dealer. Ensure the barcode or serial number is correct.",
      });
    }

    if (product.isAssignedToSubDealer) {
      return res
        .status(400)
        .json({ message: "Product already assigned to a sub-dealer" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      {
        assignedToSubDealer: subDealerId,
        isAssignedToSubDealer: true,
        assignedToSubDealerAt: new Date(),
      },
      { new: true }
    ).populate("category", "name");

    console.log("Assigned Product:", updatedProduct);

    res.status(200).json({
      message: "Product assigned to sub-dealer successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "[Backend] Error assigning product to sub-dealer:",
      error.message
    );
    res.status(500).json({
      message: "Failed to assign product to sub-dealer",
      error: error.message,
    });
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
