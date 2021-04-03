module.exports = {
  getCurrentDate: function (datedelimiter) {
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + datedelimiter + month + datedelimiter + day;
    return today;
  },
  addDay: function (date, addDay, hours = 00, min = 00, second = 00) {
    try {
      var result = new Date(date);
      result.setDate(result.getDate() + addDay);
      result.setHours(hours, min, second);
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  getISODate: function (date) {
    var result = new Date(date);
    return result.toISOString();
  },
  getCurrentDateWithTime: function (datedelimiter) {
    var today = new Date();
    var date =
      today.getFullYear() +
      datedelimiter +
      (today.getMonth() + 1) +
      datedelimiter +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
  },
  isValidDate: function (date) {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
  },
};
