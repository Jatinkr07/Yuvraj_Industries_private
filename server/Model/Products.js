import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    power: {
      type: String,
      required: true,
      trim: true,
    },
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    maxDischarge: {
      type: String,
      required: true,
      trim: true,
    },
    maxHead: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    warranty: {
      type: String,
      required: true,
      trim: true,
    },
    pipeSize: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    barcode: {
      type: String,
      required: true,
      unique: true,
    },
    addedOn: {
      type: Date,
      default: Date.now,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      default: null,
    },
    isAssigned: { type: Boolean, default: false },
    assignedAt: { type: Date },
  },
  {
    timestamps: true,
  }
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
