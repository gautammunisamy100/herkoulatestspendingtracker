const bcrypt = require("bcrypt-nodejs");
const jwtService = require("./jwt-service");
const emailService = require("./email-service");
const User = require("../models/user-model");
const SALT_FACTOR = 10;
const EmailRegex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

module.exports = {
  createUser: async function (username, password, emailAddress) {
    const user = await User.find({ username: username }).exec();
    if (user.length) {
      throw { status: 400, message: "UserName already exist" };
    } else {
      const salt = bcrypt.genSaltSync(SALT_FACTOR);
      const hashPassword = bcrypt.hashSync(password, salt);
      var newUser = new User({
        username: username,
        password: hashPassword,
        emailAddress: emailAddress,
      });
      await newUser.save();
      return true;
    }
  },
  checkUser: async function (username, password, remember = false) {
    const user = await this.getUser({ username: username });
    if (!user) throw { status: 400, message: "Username doesn’t Exist" };

    if (bcrypt.compareSync(password, user.password)) {
      let data = new Object({
        userId: user._id,
        username: user.username,
      });
      let hours = remember === "true" ? 144 : 1;
      return jwtService.getJwtToken(data, hours);
    }
    throw { status: 400, message: "Password is Wrong" };
  },
  validateAuthInput: function (username, password, emailAddress = "") {
    let errormessage = "";
    if (username.length < 4 || username.length > 20) {
      errormessage += `Username length should be greater than 4 or less than 20.\n`;
    }
    if (password.length < 4 || password.length > 20) {
      errormessage += `Password length should be greater than 4 or less than 20.\n`;
    }
    if (/\s/.test(username)) {
      errormessage += `Username can not have space.`;
    } else if (/[1-9!@#$%^&*()]+/.test(username)) {
      errormessage += `Username can have only alphabets.`;
    }

    if (/\s/.test(password)) {
      errormessage += `Password can not have space.`;
    }

    if ("" !== emailAddress && !EmailRegex.test(emailAddress)) {
      errormessage += `Enter a Valid Email.`;
    }
    return errormessage;
  },
  getUser: async function (find) {
    return User.findOne(find).exec();
  },
  setNewPassword: async function (username, password, newPassword) {
    const user = await this.getUser({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const salt = bcrypt.genSaltSync(SALT_FACTOR);
      const hashPassword = bcrypt.hashSync(newPassword, salt);
      await User.updateOne(
        { username: user.username },
        { password: hashPassword },
        {
          upsert: true,
          safe: true,
        }
      ).exec();
      return true;
    }
    throw { status: 400, message: "Current Password Entered is Wrong" };
  },
  setNewPasswordandMailIt: async function (userId) {
    let ObjectId = require("mongodb").ObjectID;
    let user = await User.findById({ _id: ObjectId(userId) }).exec();
    if (user) {
      const password = this.createPassword(12);
      const salt = bcrypt.genSaltSync(SALT_FACTOR);
      const hashPassword = bcrypt.hashSync(password, salt);
      await User.updateOne(
        { username: user.username },
        { password: hashPassword },
        {
          upsert: true,
          safe: true,
        }
      ).exec();

      result = await emailService.sendPasswordResetEmail(
        user.emailAddress,
        password,
        user.username
      );
    }
    throw `No user found`;
  },
  updateUserEmail: async function (username, password, emailAddress) {
    const user = await this.getUser({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      await User.updateOne(
        { username: username },
        { emailAddress: emailAddress },
        {
          upsert: true,
          safe: true,
        }
      ).exec();
      return true;
    }
    throw { status: 400, message: "Current Password Entered is Wrong" };
  },
  createPassword: function (maxLengthPass) {
    var collectionOfLetters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%^&()*";
    var generatedPassword = "";
    var size = collectionOfLetters.length;
    for (var i = 0; i < maxLengthPass; ++i) {
      generatedPassword =
        generatedPassword +
        collectionOfLetters.charAt(Math.floor(Math.random() * size));
    }
    return generatedPassword;
  },
};
