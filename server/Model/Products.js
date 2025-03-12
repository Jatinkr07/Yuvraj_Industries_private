import mongoose from "mongoose";
import fs from "fs/promises";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: String, required: true },
    subSubcategory: { type: String, required: true },
    power: { type: String, required: true, trim: true },
    volts: { type: String, required: true, trim: true },
    phase: { type: String, required: true, trim: true },
    stage: { type: String, required: true, trim: true },
    maxDischarge: { type: String, required: true, trim: true },
    maxHead: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, unique: true, trim: true },
    images: [{ type: String }],
    warranty: { type: String, required: true, trim: true },
    warrantyUnit: {
      type: String,
      enum: ["days", "months", "years"],
      required: true,
    },
    warrantyStartDate: { type: Date },
    warrantyEndDate: { type: Date },
    pipeSize: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    quantityText: { type: String, required: true, trim: true },
    barcode: { type: String, required: true, unique: true },
    addedOn: { type: Date, default: Date.now },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      default: null,
    },
    isAssigned: { type: Boolean, default: false },
    assignedAt: { type: Date },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    assignedToSubDealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubDealer",
      default: null,
    },
    isAssignedToSubDealer: { type: Boolean, default: false },
    assignedToSubDealerAt: { type: Date },
    isReplaced: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

productSchema.index({ productName: "text", serialNumber: "text" });

productSchema.pre("remove", async function (next) {
  if (this.images && this.images.length > 0) {
    try {
      for (const image of this.images) {
        await fs.unlink(image);
      }
    } catch (error) {
      console.error("Error deleting product images:", error);
    }
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
