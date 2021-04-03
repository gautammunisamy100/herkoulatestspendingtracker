let Agenda = require("agenda");
const dotenv = require("dotenv");
dotenv.config();
const mogoURI = process.env.MOGO_URI;

const agenda = new Agenda({
  db: {
    address: mogoURI,
    collection: "SpendingTrackerJobs",
    options: { useUnifiedTopology: true },
  },
});

agenda.processEvery("2 minutes");
let jobTypes = ["email-job"];

jobTypes.forEach((type) => {
  require("./" + type)(agenda);
});

if (jobTypes.length) {
  agenda.on("ready", async () => {
    await agenda.start();
    const errorReportReport = agenda.create("sendErrorEmail");
    errorReportReport
      .repeatEvery(process.env.ERROR_LOG_TIME)
      .unique({ name: "sendErrorEmail" })
      .save();
  });
}

agenda.on("complete", (job) => {
  if (job.attrs.name === "credentialEmail") {
    try {
      job.remove();
    } catch (e) {
      console.error("Error removing job from collection");
    }
  }
});

let graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
