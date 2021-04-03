const UserPreference = require("../models/user-preference-model");

module.exports = {
  createUserPreference: async function (userId, currency) {
    const newUserPreference = new UserPreference({
      userId: userId,
      currency: currency,
    });
    await newUserPreference.save();
    return true;
  },
  getUserCurrency: async function (userId) {
    let userPreference = await UserPreference.findOne({
      userId: userId,
    }).exec();
    if (userPreference) {
      return userPreference.currency;
    }
    return "$";
  },
  setUserCurrency: async function (userId, currency) {
    const userPreference = await UserPreference.findOne({
      userId: userId,
    }).exec();
    if (userPreference) {
      let filterUser = { userId: userId },
        update = { currency: currency };
      await UserPreference.updateOne(filterUser, update, {
        upsert: true,
        safe: true,
      }).exec();
    } else {
      await this.createUserPreference(userId, currency);
    }
  },
};
