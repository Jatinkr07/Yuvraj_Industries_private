import jwt from "jsonwebtoken";
import Dealer from "../Model/Dealer.js";
import Product from "../Model/Products.js";

export const createDealer = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, username, password } =
      req.body;
    const dealer = new Dealer({
      firstName,
      lastName,
      phoneNumber,
      email,
      username,
      password,
      createdBy: req.adminId,
    });
    await dealer.save();
    res.status(201).json({ message: "Dealer created successfully", dealer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating dealer", error: error.message });
  }
};

export const dealerLogin = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const dealer = await Dealer.findOne({
      $or: [{ username: identifier }, { phoneNumber: identifier }],
    });

    if (!dealer || !(await dealer.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: dealer._id, role: "dealer" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("dealerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
    });
    console.log("Login --> token -->", token);
    res.status(200).json({
      message: "Login successful",
      dealerId: dealer._id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

export const getDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().select("-password");
    res.status(200).json(dealers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dealers", error: error.message });
  }
};

export const getDealerProducts = async (req, res) => {
  try {
    const dealerId = req.params.dealerId || req.dealerId;
    if (!dealerId) {
      return res.status(400).json({ message: "Dealer ID is required" });
    }

    const products = await Product.find({ assignedTo: dealerId })
      .populate("category", "name")
      .sort({ assignedAt: -1 });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dealer products",
      error: error.message,
    });
  }
};

export const updateDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, email } = req.body;

    const dealer = await Dealer.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber, email },
      { new: true, runValidators: true }
    );

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    res.status(200).json({ message: "Dealer updated successfully", dealer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating dealer", error: error.message });
  }
};

export const deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await Dealer.findByIdAndDelete(id);
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }
    res.status(200).json({ message: "Dealer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting dealer", error: error.message });
  }
};
