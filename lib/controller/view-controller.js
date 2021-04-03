module.exports = {
  record: function (req, res) {
    res.render("record_page", {
      username: req.username,
    });
  },
  authPage: function (req, res) {
    res.render("auth_page");
  },
  analytic: function (req, res) {
    res.render("analytic_page", {
      username: req.username,
    });
  },
  add: function (req, res) {
    res.render("add_page", {
      username: req.username,
    });
  },
  setting: function (req, res) {
    res.render("setting_page", {
      username: req.username,
    });
  },
  cdrecord: function (req, res) {
    res.render("debit_credit_page", {
      username: req.username,
    });
  },
  forgot: function (req, res) {
    res.render("forgot_page");
  },
  notfound: function (req, res) {
    res.render("oops_page");
  },
};
