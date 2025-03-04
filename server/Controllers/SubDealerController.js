import jwt from "jsonwebtoken";
import SubDealer from "../Model/SubDealer.js";
import Product from "../Model/Products.js";

export const createSubDealer = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, username, password } =
      req.body;
    const subDealer = new SubDealer({
      firstName,
      lastName,
      phoneNumber,
      email,
      username,
      password,
      createdBy: req.dealerId,
    });
    await subDealer.save();
    res
      .status(201)
      .json({ message: "Sub-dealer created successfully", subDealer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating sub-dealer", error: error.message });
  }
};

export const subDealerLogin = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const subDealer = await SubDealer.findOne({
      $or: [{ username: identifier }, { phoneNumber: identifier }],
    });

    if (!subDealer || !(await subDealer.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: subDealer._id, role: "subDealer" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("subDealerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

export const getSubDealers = async (req, res) => {
  try {
    console.log("Dealer ---->", req.dealerId);
    const subDealers = await SubDealer.find({ createdBy: req.dealerId }).select(
      "-password"
    );
    res.status(200).json(subDealers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sub-dealers", error: error.message });
  }
};

export const updateSubDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, email } = req.body;

    const subDealer = await SubDealer.findOneAndUpdate(
      { _id: id, createdBy: req.dealerId },
      { firstName, lastName, phoneNumber, email },
      { new: true, runValidators: true }
    );

    if (!subDealer) {
      return res.status(404).json({ message: "Sub-dealer not found" });
    }

    res
      .status(200)
      .json({ message: "Sub-dealer updated successfully", subDealer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating sub-dealer", error: error.message });
  }
};

export const deleteSubDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const subDealer = await SubDealer.findOneAndDelete({
      _id: id,
      createdBy: req.dealerId,
    });
    if (!subDealer) {
      return res.status(404).json({ message: "Sub-dealer not found" });
    }
    res.status(200).json({ message: "Sub-dealer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting sub-dealer", error: error.message });
  }
};

export const getSubDealerProducts = async (req, res) => {
  try {
    const subDealerId = req.subDealerId;
    const products = await Product.find({
      assignedToSubDealer: subDealerId,
      isAssignedToSubDealer: true,
    })
      .populate("category", "name")
      .sort({ assignedToSubDealerAt: -1 });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sub-dealer products",
      error: error.message,
    });
  }
};
