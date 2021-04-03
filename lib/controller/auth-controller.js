const userService = require("../service/user-service");
const sanitizer = require("sanitizer");
const agenda = require("../jobs/agenda");
const asyncHandler = require("express-async-handler");
let config = {
  maxAge: 3600000,
  httpOnly: true,
  signed: true,
};
module.exports = {
  login: asyncHandler(async function (req, res) {
    const username = sanitizer.escape(req.body.username) || "nil";
    const password = sanitizer.escape(req.body.password) || "nil";
    const remember = sanitizer.escape(req.body.remember) || "false";
    const inputValidate = userService.validateAuthInput(username, password);
    if ("" === inputValidate) {
      const userToken = await userService.checkUser(
        username,
        password,
        remember
      );
      if ("" !== userToken) {
        config.maxAge = remember === "true" ? 518400000 : 3600000;
        res.cookie("token", userToken, config);
        return res.status(200).send("ok");
      }
    }
    throw { status: 400, message: inputValidate };
  }),

  apiLogin: asyncHandler(async function (req, res) {
    const username = sanitizer.escape(req.body.username) || "";
    const password = sanitizer.escape(req.body.password) || "";
    const userToken = await userService.checkUser(username, password);
    return res.status(200).json({ token: userToken });
  }),
  register: asyncHandler(async function (req, res) {
    const username = sanitizer.escape(req.body.username) || "";
    const password = sanitizer.escape(req.body.password) || "";
    const emailAddress = sanitizer.escape(req.body.emailAddress) || "";
    const inputValidate = userService.validateAuthInput(
      username,
      password,
      emailAddress
    );
    if ("" === inputValidate) {
      await userService.createUser(username, password, emailAddress);
      return res.status(201).send("Created");
    }
    throw { status: 400, message: inputValidate };
  }),
  sendForgotEmail: asyncHandler(async function (req, res) {
    const username = sanitizer.escape(req.body.username) || "";
    const emailAddress = sanitizer.escape(req.body.emailAddress) || "";
    let filter = new Object();
    if ("" != username) {
      filter = Object.assign(filter, {
        username: username,
      });
    }
    if ("" !== emailAddress) {
      filter = Object.assign(filter, {
        emailAddress: emailAddress,
      });
    }
    const user = await userService.getUser(filter);
    if (user) {
      res.status(200).send("Email will be sent");
      agenda.now("credentialEmail", { userId: user._id });
    } else {
      throw {
        status: 400,
        message: "Entered username or emailAddress does not exist.",
      };
    }
  }),
  logout: function (req, res, next) {
    try {
      res.clearCookie("token");
      return res.redirect("/authpage");
    } catch (err) {
      next(err);
    }
  },
};
