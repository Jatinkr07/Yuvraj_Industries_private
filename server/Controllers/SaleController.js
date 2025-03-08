import Product from "../Model/Products.js";
import Sale from "../Model/SaleModel.js";
import Replacement from "../Model/Replacement.js";

// Sub-Dealer Sale (Existing)
export const createSale = async (req, res) => {
  try {
    const { code } = req.body;
    const subDealerId = req.subDealerId;

    console.log("Creating Sub-Dealer Sale - Code:", code);
    console.log("SubDealer ID:", subDealerId);

    if (!code) {
      return res
        .status(400)
        .json({ message: "No barcode or serial number provided" });
    }

    let product = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      assignedToSubDealer: subDealerId,
      isAssignedToSubDealer: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not assigned to you." });
    }

    console.log(
      "Product Warranty:",
      product.warranty,
      "Unit:",
      product.warrantyUnit
    );

    const warrantyStartDate = new Date();
    const warrantyEndDate = calculateWarrantyEndDate(
      warrantyStartDate,
      product.warranty,
      product.warrantyUnit
    );
    const warrantyPeriod = `${product.warranty} ${product.warrantyUnit}`;

    const sale = new Sale({
      productId: product._id,
      subDealerId,
      warrantyStartDate,
      warrantyEndDate,
      warrantyPeriod,
      soldBy: "subDealer",
    });
    await sale.save();

    await Product.findByIdAndUpdate(product._id, {
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      assignedToSubDealerAt: null,
      warrantyStartDate,
      warrantyEndDate,
    });

    console.log("Sub-Dealer Sale Created:", sale);
    res.status(201).json({ message: "Sale created successfully", sale });
  } catch (error) {
    console.error("[Backend] Error creating sub-dealer sale:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create sale", error: error.message });
  }
};

export const assignProductToDealer = async (req, res) => {
  try {
    const { code } = req.body;
    const dealerId = req.dealerId;

    if (!code) {
      return res
        .status(400)
        .json({ message: "No barcode or serial number provided" });
    }

    const product = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      assignedTo: null,
      isAssigned: false,
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      isReplaced: false,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or already assigned/sold/replaced",
      });
    }

    product.assignedTo = dealerId;
    product.isAssigned = true;
    product.assignedAt = new Date();
    await product.save();

    res.status(200).json({ message: "Product assigned to dealer", product });
  } catch (error) {
    console.error(
      "[Backend] Error assigning product to dealer:",
      error.message
    );
    res
      .status(500)
      .json({ message: "Failed to assign product", error: error.message });
  }
};

//Sub dealer product assign
export const assignProductToSubDealer = async (req, res) => {
  try {
    const { code } = req.body;
    const subDealerId = req.subDealerId;
    const dealerId = req.dealerId;

    if (!code) {
      return res
        .status(400)
        .json({ message: "No barcode or serial number provided" });
    }

    let product = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      assignedTo: dealerId,
      isAssigned: true,
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      isReplaced: false,
    });

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found, not assigned to your dealer, or already assigned/sold/replaced",
      });
    }

    product.assignedToSubDealer = subDealerId;
    product.isAssignedToSubDealer = true;
    product.assignedToSubDealerAt = new Date();
    product.assignedTo = null; // Remove from dealer
    product.isAssigned = false;
    await product.save();

    res
      .status(200)
      .json({ message: "Product assigned to sub-dealer", product });
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

// Dealer Sale (New)
export const createDealerSale = async (req, res) => {
  try {
    const { code } = req.body;
    const dealerId = req.dealerId;

    console.log("Creating Dealer Sale - Code:", code);
    console.log("Dealer ID:", dealerId);

    if (!code) {
      return res
        .status(400)
        .json({ message: "No barcode or serial number provided" });
    }

    const product = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      assignedTo: dealerId,
      isAssigned: true,

      isAssignedToSubDealer: false,
      isReplaced: false,
    });

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found, not assigned to you, or already sold/replaced",
      });
    }

    console.log("PRODUCT ---->", product);

    const warrantyStartDate = new Date();
    const warrantyEndDate = calculateWarrantyEndDate(
      warrantyStartDate,
      product.warranty,
      product.warrantyUnit
    );
    const warrantyPeriod = `${product.warranty} ${product.warrantyUnit}`;

    const sale = new Sale({
      productId: product._id,
      dealerId,
      warrantyStartDate,
      warrantyEndDate,
      warrantyPeriod,
      soldBy: "dealer",
    });
    await sale.save();

    product.assignedTo = null;
    product.isAssigned = false;
    product.warrantyStartDate = warrantyStartDate;
    product.warrantyEndDate = warrantyEndDate;
    await product.save();

    res.status(201).json({ message: "Dealer sale created successfully", sale });
  } catch (error) {
    console.error("[Backend] Error creating dealer sale:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create dealer sale", error: error.message });
  }
};

// Get Sub-Dealer Sales (Existing)
export const getSales = async (req, res) => {
  try {
    const subDealerId = req.subDealerId;
    const sales = await Sale.find({ subDealerId })
      .populate(
        "productId",
        "productName barcode serialNumber warranty warrantyUnit"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({ sales });
  } catch (error) {
    console.error("Error fetching sub-dealer sales:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch sales", error: error.message });
  }
};

// Get Dealer Sales (New)
export const getDealerSales = async (req, res) => {
  try {
    const dealerId = req.dealerId;
    const sales = await Sale.find({ dealerId })
      .populate(
        "productId",
        "productName barcode serialNumber warranty warrantyUnit"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({ sales });
  } catch (error) {
    console.error("Error fetching dealer sales:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch dealer sales", error: error.message });
  }
};

// Replace Product (Sub-Dealer, Existing)
export const replaceProduct = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { code } = req.body;
    const subDealerId = req.subDealerId;

    console.log(
      "Replacing Product (Sub-Dealer) - Sale ID:",
      saleId,
      "Code:",
      code
    );

    if (!code) {
      return res.status(400).json({
        message: "No barcode or serial number provided for replacement",
      });
    }

    const sale = await Sale.findById(saleId).populate("productId");
    if (!sale || sale.subDealerId?.toString() !== subDealerId) {
      return res
        .status(404)
        .json({ message: "Sale not found or unauthorized" });
    }

    const now = new Date();
    if (new Date(sale.warrantyEndDate) < now) {
      return res.status(400).json({ message: "Warranty has expired" });
    }

    // Calculate remaining warranty
    const remainingWarrantyStart = sale.warrantyStartDate;
    const remainingWarrantyEnd = sale.warrantyEndDate;

    // Find the new product: Must be assigned to the same sub-dealer
    let newProduct = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      assignedToSubDealer: subDealerId,
      isAssignedToSubDealer: true,
    });

    console.log("New Product Found (Sub-Dealer):", newProduct || "None");

    if (!newProduct) {
      return res.status(404).json({
        message:
          "Replacement product not found or not assigned to you as a sub-dealer",
      });
    }

    // Create replacement record for the original product
    const replacement = new Replacement({
      originalProductId: sale.productId._id,
      newProductId: newProduct._id,
      subDealerId,
      warrantyStartDate: remainingWarrantyStart,
      warrantyEndDate: remainingWarrantyEnd,
    });
    await replacement.save();

    // Create a new sale for the replacement product with the remaining warranty
    const newSale = new Sale({
      productId: newProduct._id,
      subDealerId,
      warrantyStartDate: remainingWarrantyStart,
      warrantyEndDate: remainingWarrantyEnd,
      warrantyPeriod: sale.warrantyPeriod,
      soldBy: "subDealer",
    });
    await newSale.save();

    // Update the new product: Ensure it remains assigned to the sub-dealer
    await Product.findByIdAndUpdate(newProduct._id, {
      assignedToSubDealer: subDealerId,
      isAssignedToSubDealer: true,
      assignedToSubDealerAt: new Date(),
      warrantyStartDate: remainingWarrantyStart,
      warrantyEndDate: remainingWarrantyEnd,
    });

    // Update the original product: Move to replaced state
    await Product.findByIdAndUpdate(sale.productId._id, {
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      assignedToSubDealerAt: null,
      warrantyStartDate: null,
      warrantyEndDate: null,
      isReplaced: true,
    });

    // Delete the original sale
    await Sale.findByIdAndDelete(saleId);

    console.log("Sub-Dealer Replacement Created:", replacement);
    res.status(200).json({
      message:
        "Product replaced and new sale created for sub-dealer with remaining warranty",
      replacement,
    });
  } catch (error) {
    console.error(
      "[Backend] Error replacing sub-dealer product:",
      error.message
    );
    res
      .status(500)
      .json({ message: "Failed to replace product", error: error.message });
  }
};

// Replace Product (Dealer, New)
export const replaceDealerProduct = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { code } = req.body;
    const dealerId = req.dealerId;

    console.log("Replacing Product (Dealer) - Sale ID:", saleId, "Code:", code);

    if (!code) {
      return res.status(400).json({
        message: "No barcode or serial number provided for replacement",
      });
    }

    const sale = await Sale.findById(saleId).populate("productId");
    if (
      !sale ||
      sale.dealerId?.toString() !== dealerId ||
      sale.soldBy !== "dealer"
    ) {
      return res.status(404).json({
        message: "Sale not found, unauthorized, or sold by sub-dealer",
      });
    }

    const now = new Date();
    if (new Date(sale.warrantyEndDate) < now) {
      return res.status(400).json({ message: "Warranty has expired" });
    }

    const remainingWarrantyStart = sale.warrantyStartDate;
    const remainingWarrantyEnd = sale.warrantyEndDate;

    let newProduct = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      assignedTo: dealerId,
      isAssigned: true,
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      isReplaced: false,
    });

    if (!newProduct) {
      return res.status(404).json({
        message:
          "Replacement product not found, not assigned to you, or already sold/replaced",
      });
    }

    const replacement = new Replacement({
      originalProductId: sale.productId._id,
      newProductId: newProduct._id,
      dealerId,
      warrantyStartDate: remainingWarrantyStart,
      warrantyEndDate: remainingWarrantyEnd,
    });
    await replacement.save();

    const newSale = new Sale({
      productId: newProduct._id,
      dealerId,
      warrantyStartDate: remainingWarrantyStart,
      warrantyEndDate: remainingWarrantyEnd,
      warrantyPeriod: sale.warrantyPeriod,
      soldBy: "dealer",
    });
    await newSale.save();

    await Product.findByIdAndUpdate(newProduct._id, {
      assignedTo: dealerId,
      isAssigned: true,
      warrantyStartDate: remainingWarrantyStart,
      warrantyEndDate: remainingWarrantyEnd,
    });

    await Product.findByIdAndUpdate(sale.productId._id, {
      assignedTo: null,
      isAssigned: false,
      warrantyStartDate: null,
      warrantyEndDate: null,
      isReplaced: true,
    });

    await Sale.findByIdAndDelete(saleId);

    res.status(200).json({
      message:
        "Product replaced and new sale created for dealer with remaining warranty",
      replacement,
    });
  } catch (error) {
    console.error("[Backend] Error replacing dealer product:", error.message);
    res
      .status(500)
      .json({ message: "Failed to replace product", error: error.message });
  }
};

// Get Sub-Dealer Replacements (Existing)
export const getReplacements = async (req, res) => {
  try {
    const subDealerId = req.subDealerId;
    const replacements = await Replacement.find({ subDealerId })
      .populate("originalProductId", "productName serialNumber")
      .populate("newProductId", "serialNumber")
      .sort({ replacedDate: -1 });

    res.status(200).json({ replacements });
  } catch (error) {
    console.error("Error fetching sub-dealer replacements:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch replacements", error: error.message });
  }
};

// Get Dealer Replacements (New)
export const getDealerReplacements = async (req, res) => {
  try {
    const dealerId = req.dealerId;
    const replacements = await Replacement.find({ dealerId })
      .populate("originalProductId", "productName serialNumber")
      .populate("newProductId", "serialNumber")
      .sort({ replacedDate: -1 });

    res.status(200).json({ replacements });
  } catch (error) {
    console.error("Error fetching dealer replacements:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch replacements", error: error.message });
  }
};

// Warranty End Date Calculation (Helper Function)
function calculateWarrantyEndDate(startDate, warranty, unit) {
  const endDate = new Date(startDate);
  const warrantyValue = parseInt(warranty, 10);

  switch (unit) {
    case "days":
      endDate.setDate(endDate.getDate() + warrantyValue);
      break;
    case "months":
      endDate.setMonth(endDate.getMonth() + warrantyValue);
      break;
    case "years":
      endDate.setFullYear(endDate.getFullYear() + warrantyValue);
      break;
    default:
      throw new Error(`Invalid warranty unit: ${unit}`);
  }
  return endDate;
}
