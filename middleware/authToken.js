import jwt from "jsonwebtoken";

async function authToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "User not found, please login to continue.",
      error: true,
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token.",
      });
    }

    req.userId = decoded.userId || decoded._id; // Adjust based on your token payload
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      error: true,
      success: false,
    });
  }
}

export default authToken;
