import jwt from "jsonwebtoken";
import SubDealer from "../Model/SubDealer.js";

export const isAuthenticated = (req, res, next) => {
  if (req.cookies.adminAuth === "authenticated") {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const isDealerAuthenticated = (req, res, next) => {
  const token = req.cookies?.dealerToken;

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

export const isSubDealerAuthenticated = (req, res, next) => {
  const token = req.cookies.subDealerToken;

  if (!token) {
    return res.status(401).json({ message: "No sub-dealer token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.subDealerId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authenticateSubDealer = (req, res, next) => {
  const token = req.cookies.subDealerToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.subDealerId = decoded.id;
    req.role = decoded.role;

    SubDealer.findById(decoded.id)
      .then((subDealer) => {
        if (!subDealer) {
          return res.status(404).json({ message: "Sub-dealer not found" });
        }
        req.dealerId = subDealer.createdBy;
        console.log(
          "Authenticated - SubDealer ID:",
          req.subDealerId,
          "Dealer ID:",
          req.dealerId
        );
        next();
      })
      .catch((err) => {
        console.error("Error fetching sub-dealer:", err);
        res.status(500).json({ message: "Server error" });
      });
  });
};
