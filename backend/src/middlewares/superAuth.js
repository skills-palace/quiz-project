const jwt = require("jsonwebtoken");
const ErrorHandler = require("../services/ErrorHandler");
const { JWT_SECRET } = require("../confiq");

const superAuth = (req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token) {
    return next(ErrorHandler.unAuthorize("token not Found"));
  }

  try {
    const { _id, userType } = jwt.verify(access_token, JWT_SECRET);
    if (!userType === "admin") return next(ErrorHandler.unAuthorize());
    
    req.userId = _id;
    next();
  } catch (error) {
    return next(ErrorHandler.unAuthorize("token invalid or expire"));
  }
};

module.exports = superAuth;
