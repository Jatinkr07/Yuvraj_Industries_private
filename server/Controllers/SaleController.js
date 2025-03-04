// Controller/SaleController.js
import Product from "../Model/Products.js";
import Replacement from "../Model/Replacement.js";
import Sale from "../Model/SaleModel.js";

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

    console.log("Found Product for Sale:", product || "None");

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found or not assigned to you. Ensure the barcode or serial number is correct.",
      });
    }

    const sale = new Sale({
      productId: product._id,
      subDealerId,
      warrantyPeriod: product.warranty,
    });
    await sale.save();

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      {
        assignedToSubDealer: null,
        isAssignedToSubDealer: false,
        assignedToSubDealerAt: null,
      },
      { new: true }
    );

    console.log("Sale Created:", sale);
    console.log("Product Updated:", updatedProduct);

    res.status(201).json({
      message: "Sale created successfully",
      sale,
      product: updatedProduct,
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
      .populate("productId", "productName barcode serialNumber warranty")
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

    // Find the sale
    const sale = await Sale.findById(saleId).populate("productId");
    if (!sale || sale.subDealerId.toString() !== subDealerId) {
      return res
        .status(404)
        .json({ message: "Sale not found or unauthorized" });
    }

    // Check warranty expiration
    const now = new Date();
    if (new Date(sale.warrantyEndDate) < now) {
      return res.status(400).json({ message: "Warranty has expired" });
    }

    // Find the new product
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
        message:
          "Replacement product not found or already assigned to a sub-dealer",
      });
    }

    if (newProduct.isAssignedToSubDealer) {
      return res.status(400).json({
        message: "Replacement product is already assigned to a sub-dealer",
      });
    }

    // Create replacement record
    const replacement = new Replacement({
      originalProductId: sale.productId._id,
      newProductId: newProduct._id,
      subDealerId,
      warrantyStartDate: sale.warrantyStartDate,
      warrantyEndDate: sale.warrantyEndDate,
    });
    await replacement.save();

    // Update products
    await Product.findByIdAndUpdate(sale.productId._id, {
      assignedToSubDealer: null,
      isAssignedToSubDealer: false,
      assignedToSubDealerAt: null,
    });

    await Product.findByIdAndUpdate(newProduct._id, {
      assignedToSubDealer: subDealerId,
      isAssignedToSubDealer: true,
      assignedToSubDealerAt: new Date(),
    });

    // Remove the sale
    await Sale.findByIdAndDelete(saleId);

    console.log("Replacement Created:", replacement);

    res.status(200).json({
      message: "Product replaced successfully",
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
