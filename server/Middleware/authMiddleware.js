import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  if (req.cookies.adminAuth === "authenticated") {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const isDealerAuthenticated = (req, res, next) => {
  const token = req.cookies.dealerToken;

  if (!token) {
    return res.status(401).json({ message: "No dealer token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.dealerId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
