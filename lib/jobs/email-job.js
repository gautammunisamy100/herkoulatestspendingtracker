const userService = require("../service/user-service");
const emailService = require("../service/email-service");

module.exports = function (agenda) {
  agenda.define(
    "credentialEmail",
    { priority: "high", concurrency: 10 },
    async (job) => {
      try {
        await userService.setNewPasswordandMailIt(job.attrs.data.userId);
      } catch (err) {}
    }
  );
  agenda.define(
    "sendErrorEmail",
    { priority: "high", concurrency: 10 },
    async () => {
      //await emailService.sendErrorEmailToDev();
    }
  );
};
