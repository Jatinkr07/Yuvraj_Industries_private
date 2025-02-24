export const isAuthenticated = (req, res, next) => {
  if (req.cookies.adminAuth === "authenticated") {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const isDealerAuthenticated = (req, res, next) => {
  if (req.cookies.subDealerAuth === "authenticated") {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
