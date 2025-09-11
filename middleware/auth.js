// middleware/auth.js di report
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_long_random_access_secret_change_me";

export function verifyToken(req, res, next) {
  let token;

  // cek dari Authorization header dulu
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    token = authHeader.split(" ")[1];
  }

  // fallback: kalau gak ada, ambil dari cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
