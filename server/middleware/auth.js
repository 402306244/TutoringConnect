// Middleware used to protect routes by verifying the JWT sent in the Authorization header.
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export function authenticate(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Login required." });
  }
}

export function role(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
}
