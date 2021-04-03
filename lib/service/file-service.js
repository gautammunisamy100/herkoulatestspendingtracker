const fs = require("fs");

module.exports = {
  writeErrorToLog: function (data) {
    fs.appendFile("error.log", data, "ascii", function (err) {
      if (err) console.log("Error while writing err to log " + err.message);
    });
  },
  clearLogError: function () {
    fs.writeFile("error.log", "", "ascii", function (err) {
      if (err) console.log("Error while writing err to log " + err.message);
    });
  },
  getfileSize: function (filepath) {
    var fs = require("fs");
    var stats = fs.statSync(filepath);
    var fileSizeInBytes = stats.size;
    return (fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024));
  },
};
