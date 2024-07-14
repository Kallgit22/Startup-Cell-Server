const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Set up Global configuration access
dotenv.config();

const ACCESS_TOKEN_EXPIRY = "1h";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_ACCESS_SECRET = process.env.JWT_SECRET_KEY;
const HEADER_KEY = process.env.TOKEN_HEADER_KEY.toLowerCase(); // Ensure it's lowercased for consistency

const generateAccessToken = (id) => {
  return jwt.sign({ id }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Refresh token endpoint
const getRefreshToken = (req, res) => {
  const token = req.body.token; // Adjust header name as needed
  if (!token) return res.status(401).json({ error: "Token not provided" });

  jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });
    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  });
};

// Verify access token middleware
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Use lowercase to be consistent with header handling
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from Authorization header
  if (!token)
    return res.status(401).json({ error: "Access token not provided" });

  jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
  if (err){
    return res.status(403).json({ error: "Invalid access token" });
  } 
    req.user = decoded.id; // Attach user ID to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { getRefreshToken, verifyAccessToken };
