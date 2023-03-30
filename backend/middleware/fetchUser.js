var jwt = require("jsonwebtoken");
const JWT_SECRET = "Harryisagoodb$oy";

//here the next is the await of the auth.js getuser route and the req is the fetchuser from this file
const fetchUser = (req, res, next) => {
  //get the user from jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please auntheticate using valid token" });
  }
  try {
    const string = jwt.verify(token, JWT_SECRET);
    req.userDetails = string.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "please auntheticate using valid token" });
  }
};

module.exports = fetchUser;
