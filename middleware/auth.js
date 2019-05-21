const jwt = require("jsonwebtoken");
const config = require("config");

/**
 * User authorization middleware.
 *
 * @param x-auth-token the token of the user
 *
 * @return error on authorization failure
 */
module.exports = function(req, res, next) {
  if (!config.get("requiresAuth")) return next();
  console.log("auth req'd");
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    console.log("decoded, sending: ", decoded);
    next();
  } catch (ex) {
    res.status(401).send("Invalid token, please login again");
  }
};
