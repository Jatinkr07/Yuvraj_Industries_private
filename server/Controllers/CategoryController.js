import fs from "fs";
import path from "path";
import busboy from "busboy";
import Category from "../Model/Category.js";

const uploadDir = path.join("uploads", "category");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const removeImage = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join("uploads", imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

export const createCategory = async (req, res) => {
  const bb = busboy({ headers: req.headers });
  let categoryData = { subcategories: [] };
  let imagePath = null;

  bb.on("file", (_, file, info) => {
    const { filename } = info;
    const fileName = `${Date.now()}_${filename}`;
    imagePath = path.join("category", fileName);
    const savePath = path.join(uploadDir, fileName);
    file.pipe(fs.createWriteStream(savePath));
  });

  bb.on("field", (key, value) => {
    if (key === "subcategories") {
      categoryData.subcategories = JSON.parse(value);
    } else {
      categoryData[key] = value;
    }
  });

  bb.on("finish", async () => {
    try {
      const newCategory = new Category({
        name: categoryData.name,
        image: imagePath || "",
        subcategories: categoryData.subcategories,
      });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error creating category", details: error.message });
    }
  });

  req.pipe(bb);
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ error: "Category not found" });

  const bb = busboy({ headers: req.headers });
  let updatedData = { subcategories: category.subcategories };
  let newImagePath = null;

  bb.on("file", (_, file, info) => {
    const { filename } = info;
    const fileName = `${Date.now()}_${filename}`;
    newImagePath = path.join("category", fileName);
    const savePath = path.join(uploadDir, fileName);
    file.pipe(fs.createWriteStream(savePath));
  });

  bb.on("field", (key, value) => {
    if (key === "subcategories") {
      updatedData.subcategories = JSON.parse(value);
    } else {
      updatedData[key] = value;
    }
  });

  bb.on("finish", async () => {
    try {
      const updateFields = {
        name: updatedData.name,
        subcategories: updatedData.subcategories,
      };
      if (newImagePath) {
        if (category.image) removeImage(category.image);
        updateFields.image = newImagePath;
      } else if (updatedData.image === "") {
        if (category.image) removeImage(category.image);
        updateFields.image = "";
      } else {
        updateFields.image = category.image;
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
      res.json(updatedCategory);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating category", details: error.message });
    }
  });

  req.pipe(bb);
};

export const removeCategoryImage = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    if (category.image) removeImage(category.image);
    await Category.findByIdAndUpdate(id, { image: null });
    res.json({ message: "Image removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing image" });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    if (category.image) removeImage(category.image);
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};
