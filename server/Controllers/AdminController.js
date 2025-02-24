import config from "../Config/config.js";

export const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username === config.ADMIN_USERNAME &&
    password === config.ADMIN_PASSWORD
  ) {
    res.cookie("adminAuth", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000,
    });
    return res.status(200).json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

export const adminLogout = (req, res) => {
  res.clearCookie("adminAuth", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const adminProtected = (req, res) => {
  if (req.cookies.adminAuth === "authenticated") {
    return res.status(200).json({ message: "You are authenticated" });
  }

  return res.status(401).json({ message: "Unauthorized" });
};
