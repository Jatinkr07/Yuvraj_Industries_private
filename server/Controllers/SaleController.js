import Product from "../Model/Products.js";
import Sale from "../Model/SaleModel.js";
import Replacement from "../Model/Replacement.js";

export const createSale = async (req, res) => {
  try {
    const { code } = req.body;
    const subDealerId = req.subDealerId;

    console.log("Creating Sale - Code:", code);
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
      return res.status(404).json({
        message: "Product not found or not assigned to you.",
      });
    }

    console.log(
      "Product Warranty:",
      product.warranty,
      "Unit:",
      product.warrantyUnit
    );

    const warrantyDays = calculateWarrantyDays(
      product.warranty,
      product.warrantyUnit
    );
    const warrantyStartDate = new Date();
    const warrantyEndDate = new Date(warrantyStartDate);
    warrantyEndDate.setDate(warrantyEndDate.getDate() + warrantyDays);

    const warrantyPeriod = `${product.warranty} ${product.warrantyUnit}`;

    console.log("Calculated Warranty Days:", warrantyDays);
    console.log("Warranty Start Date:", warrantyStartDate);
    console.log("Warranty End Date:", warrantyEndDate);

    const sale = new Sale({
      productId: product._id,
      subDealerId,
      warrantyStartDate,
      warrantyEndDate,
      warrantyPeriod,
    });
    await sale.save();

    const savedSale = await Sale.findById(sale._id);
    console.log(
      "Saved Warranty End Date:",
      savedSale.warrantyEndDate.toISOString()
    );

    await Product.findByIdAndUpdate(product._id, {
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      assignedToSubDealerAt: null,
      warrantyStartDate,
      warrantyEndDate,
    });

    console.log("Sale Created:", sale);
    res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    console.error("[Backend] Error creating sale:", error.message);
    res.status(500).json({
      message: "Failed to create sale",
      error: error.message,
    });
  }
};

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
    console.error("Error fetching sales:", error);
    res.status(500).json({
      message: "Failed to fetch sales",
      error: error.message,
    });
  }
};

export const replaceProduct = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { code } = req.body;
    const subDealerId = req.subDealerId;

    console.log("Replacing Product - Sale ID:", saleId, "Code:", code);

    if (!code) {
      return res.status(400).json({
        message: "No barcode or serial number provided for replacement",
      });
    }

    const sale = await Sale.findById(saleId).populate("productId");
    if (!sale || sale.subDealerId.toString() !== subDealerId) {
      return res
        .status(404)
        .json({ message: "Sale not found or unauthorized" });
    }

    const now = new Date();
    if (new Date(sale.warrantyEndDate) < now) {
      return res.status(400).json({ message: "Warranty has expired" });
    }

    let newProduct = await Product.findOne({
      $or: [{ barcode: code }, { serialNumber: code }],
      $or: [
        {
          assignedTo: sale.productId.assignedTo,
          isAssigned: true,
          isAssignedToSubDealer: false,
        },
        { assignedTo: null, isAssigned: false },
      ],
    });

    console.log("New Product Found:", newProduct || "None");

    if (!newProduct) {
      return res.status(404).json({
        message: "Replacement product not found or already assigned",
      });
    }

    if (newProduct.isAssignedToSubDealer) {
      return res.status(400).json({
        message: "Replacement product is already assigned to a sub-dealer",
      });
    }

    const replacement = new Replacement({
      originalProductId: sale.productId._id,
      newProductId: newProduct._id,
      subDealerId,
      warrantyStartDate: sale.warrantyStartDate,
      warrantyEndDate: sale.warrantyEndDate,
    });
    await replacement.save();

    await Product.findByIdAndUpdate(newProduct._id, {
      assignedToSubDealer: subDealerId,
      isAssignedToSubDealer: true,
      assignedToSubDealerAt: new Date(),
      warrantyStartDate: sale.warrantyStartDate,
      warrantyEndDate: sale.warrantyEndDate,
    });

    await Product.findByIdAndUpdate(sale.productId._id, {
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      assignedToSubDealerAt: null,
      warrantyStartDate: null,
      warrantyEndDate: null,
    });

    await Sale.findByIdAndDelete(saleId);

    console.log("Replacement Created:", replacement);
    res.status(200).json({
      message: "Product replaced and reassigned to sub-dealer",
      replacement,
    });
  } catch (error) {
    console.error("[Backend] Error replacing product:", error.message);
    res.status(500).json({
      message: "Failed to replace product",
      error: error.message,
    });
  }
};

export const getReplacements = async (req, res) => {
  try {
    const subDealerId = req.subDealerId;
    const replacements = await Replacement.find({ subDealerId })
      .populate("originalProductId", "productName serialNumber")
      .populate("newProductId", "serialNumber")
      .sort({ replacedDate: -1 });

    res.status(200).json({ replacements });
  } catch (error) {
    console.error("Error fetching replacements:", error);
    res.status(500).json({
      message: "Failed to fetch replacements",
      error: error.message,
    });
  }
};

function calculateWarrantyDays(warranty, unit) {
  console.log("Calculating warranty days - Warranty:", warranty, "Unit:", unit);
  const parsedWarranty = parseInt(warranty, 10);
  if (isNaN(parsedWarranty)) {
    throw new Error("Warranty value is not a valid number");
  }
  switch (unit) {
    case "days":
      return parsedWarranty;
    case "months":
      return parsedWarranty * 30;
    case "years":
      return parsedWarranty * 365;
    default:
      throw new Error(`Invalid warranty unit: ${unit}`);
  }
}
