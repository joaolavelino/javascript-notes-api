//PART SEVEN-1-2
require("dotenv").config();
const secret = process.env.JWT_TOKEN;

const jwt = require("jsonwebtoken");

//3 - require the user model
const User = require("../models/user");

//4 - create the middleware
const WithAuth = (req, res, next) => {
  //acces the token from the request header
  const token = req.headers["x-access-token"];
  //if the password is not the same - throw unavailable resource status and error
  if (!token)
    res.status(401).json({ error: "Unauthorized: Token not provided" });
  else {
    //use the verify method on the jwt lib to decode it
    jwt.verify(token, secret, (err, decodedToken) => {
      //the verify method throw us an error - throw unavailable resource status and error
      if (err) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        //it's not on the class but if I don't throw this in here, the middleware won't close if the token is invalid
        next();
      } else {
        //inject the email extracted from the token on the request so it's possible to call it on the route
        req.email = decodedToken.email;
        //find the user using the email
        User.findOne({ email: decodedToken.email })
          .then((foundUser) => {
            //and inject the user in the requestn so it's availabe to be used on the route
            req.user = foundUser;
            //declare the end of the middleware
            next();
          })
          //if the user doesn't exist:
          .catch((err) => {
            res.status(401).json({ error: err });
          });
      }
    });
  }
};

module.exports = WithAuth;
