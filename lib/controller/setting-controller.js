const asyncHandler = require("express-async-handler");
const sanitizer = require("sanitizer");
const userPreferenceService = require("../service/user-preference-service");
const userService = require("../service/user-service");
module.exports = {
  setUserCurrency: asyncHandler(async function (req, res) {
    const userId = req.userId;
    const currency = sanitizer.escape(req.body.currency) || "$";
    await userPreferenceService.setUserCurrency(userId, currency);
    return res.status(200).send("Currency Updated");
  }),
  setUserEmail: asyncHandler(async function (req, res) {
    const username = req.username || "nil";
    const emailAddress = sanitizer.escape(req.body.emailAddress) || "";
    const password = sanitizer.escape(req.body.password) || "";

    const inputValidate = userService.validateAuthInput(
      username,
      password,
      emailAddress
    );
    if (inputValidate === "") {
      await userService.updateUserEmail(username, password, emailAddress);
      return res.status(200).send("Email Updated");
    }
    throw { status: 400, message: inputValidate };
  }),
  setUserPassword: asyncHandler(async function (req, res) {
    const password = sanitizer.escape(req.body.password) || "";
    const newPassword = sanitizer.escape(req.body.newPassword) || "";
    const username = req.username || "";
    await userService.setNewPassword(username, password, newPassword);
    return res.status(200).send("Updated Password");
  }),
};
