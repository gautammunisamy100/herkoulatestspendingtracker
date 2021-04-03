const jwt = require("jsonwebtoken");
const Dotenv = require("dotenv");
Dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const TOKEN_HEADER_KEY = process.env.TOKEN_HEADER_KEY;

module.exports = {
  getJwtToken: function (data, hours = 1) {
    return jwt.sign(data, JWT_SECRET_KEY, { expiresIn: 60 * 60 * hours });
  },
  getUserIdFromRequest: function (req) {
    const token = req.header(TOKEN_HEADER_KEY);
    return jwt.decode(token, JWT_SECRET_KEY);
  },
  getUserIdFromToken: function (token) {
    return jwt.decode(token, JWT_SECRET_KEY);
  },
};
