import mongoose from "mongoose";

const replacementSchema = new mongoose.Schema({
  originalProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  newProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  subDealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubDealer",
    required: true,
  },
  replacedDate: {
    type: Date,
    default: Date.now,
  },
  warrantyStartDate: {
    type: Date,
    required: true,
  },
  warrantyEndDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Replacement", replacementSchema);
