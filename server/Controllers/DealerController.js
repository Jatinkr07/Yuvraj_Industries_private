import Dealer from "../Model/Dealer.js";

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
    res.cookie("dealerAuth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.status(200).json({ message: "Login successful", dealerId: dealer._id });
  } catch (error) {
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
