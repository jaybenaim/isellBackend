const jwt = require("jsonwebtoken");

const withAuth = (req, res, next) => {
  const token = req.cookies.token;

  console.log(req.cookies);
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};
module.exports = withAuth;
