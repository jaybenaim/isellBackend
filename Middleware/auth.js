const jwt = require("jsonwebtoken");
const secret = "goat";

const withAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};
module.exports = withAuth;
