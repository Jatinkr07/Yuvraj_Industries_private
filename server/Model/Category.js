import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: false, default: "" },
  subcategories: [
    {
      name: { type: String, required: true },
    },
  ],
});

export default mongoose.model("Category", categorySchema);
