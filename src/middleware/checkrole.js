const jwt = require("jsonwebtoken");

const checkUserRole = (allowedRoles) => (req, res, next) => {
  const token = req.cookies.coderCookieToken;

  if (token) {
    jwt.verify(token, "coderhouse", (err, decoded) => {
      if (err) {
        res.status(403).send("Access Denied. Token Invalid.");
      } else {
        const userRole = decoded.user.role;
        if (allowedRoles.includes(userRole)) {
          next();
        } else {
          res.status(403).send("Access Denied. Permition Not Granted.");
        }
      }
    });
  } else {
    res.status(403).send("Access Denied. Token Requiered.");
  }
};

module.exports = checkUserRole;
