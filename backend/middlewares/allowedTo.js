module.exports = (...roles) => {
  return (req, res, next) => {
    // console.log("req.currentUser.role)", req.currentUser.role);
    if (!roles.includes(req.currentUser.role)) {
      // console.log("req.currentUser", req.currentUser);
      return res.json({
        message: "this role is not authorized",
        success: false,
        error: true,
      });
    }
    next();
  };
};
