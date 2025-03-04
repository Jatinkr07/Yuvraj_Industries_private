import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  subDealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubDealer",
    required: true,
  },
  warrantyStartDate: {
    type: Date,
    default: Date.now,
  },
  warrantyPeriod: {
    type: String,
    required: true,
  },
  warrantyEndDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

saleSchema.pre("save", function (next) {
  if (this.warrantyStartDate && this.warrantyPeriod) {
    const years = parseInt(this.warrantyPeriod.match(/\d+/)[0], 10);
    this.warrantyEndDate = new Date(this.warrantyStartDate);
    this.warrantyEndDate.setFullYear(
      this.warrantyEndDate.getFullYear() + years
    );
  }
  next();
});

export default mongoose.model("SaleModel", saleSchema);
