const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const autHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!autHeader) {
    return res.status(401).json("token is required");
  }
  const token = autHeader.split(" ")[1];
  // console.log("token", token);

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
    // console.log("currentUser", currentUser);
  } catch (err) {
    res.json({
      message: err.message,
      success: false,
      error: true,
    });
  }
};

module.exports = verifyToken;
