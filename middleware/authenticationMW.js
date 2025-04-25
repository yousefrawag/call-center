const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    let token = req.get("authorization").split(" ")[1];
    console.log(token)
    let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.token = decodedToken;

    next();
  } catch (err) {
    err.message = "Not authenticated ";
   res.status(401).json({mesg:"not authenticated"})
  }
};
