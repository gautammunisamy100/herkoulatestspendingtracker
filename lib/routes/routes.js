const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction-controller");
const cdTransactionController = require("../controller/cdTransaction-controller");
const authController = require("../controller/auth-controller");
const viewController = require("../controller/view-controller");
const settingController = require("../controller/setting-controller");
const middleware = require("./middleware-routes");

router.get("/", viewController.authPage);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/api/login", authController.apiLogin);
router.post("/api/register", authController.register);

router.get("/record", middleware.isAuthorized, viewController.record);
router.get("/analytic", middleware.isAuthorized, viewController.analytic);
router.get("/add", middleware.isAuthorized, viewController.add);
router.get("/setting", middleware.isAuthorized, viewController.setting);
router.get("/cdrecord", middleware.isAuthorized, viewController.cdrecord);
router.get("/authpage", viewController.authPage);
router.get("/forgot", viewController.forgot);
router.post("/sendForgotMail", authController.sendForgotEmail);

router.get(
  "/getTransaction",
  middleware.isAuthorized,
  transactionController.getTransaction
);

router.get(
  "/getCDTransaction",
  middleware.isAuthorized,
  cdTransactionController.getCDTransaction
);

router.post(
  "/addTransaction",
  middleware.isAuthorized,
  transactionController.addTransaction
);

router.post(
  "/addCDTransaction",
  middleware.isAuthorized,
  cdTransactionController.addCDTransaction
);

router.delete(
  "/deleteTransaction",
  middleware.isAuthorized,
  transactionController.deleteTransaction
);

router.delete(
  "/deleteCDTransaction",
  middleware.isAuthorized,
  cdTransactionController.deleteCDTransaction
);

router.post(
  "/updateCDTransaction",
  middleware.isAuthorized,
  cdTransactionController.updateCDTransaction
);

router.post(
  "/updateCurrency",
  middleware.isAuthorized,
  settingController.setUserCurrency
);

router.post(
  "/updatePassword",
  middleware.isAuthorized,
  settingController.setUserPassword
);

router.post(
  "/updateEmail",
  middleware.isAuthorized,
  settingController.setUserEmail
);

router.post(
  "/api/addTransaction",
  middleware.isApiAuthorized,
  transactionController.addTransaction
);
router.get(
  "/api/getTransaction",
  middleware.isApiAuthorized,
  transactionController.getTransaction
);
router.delete(
  "/api/deleteTransaction",
  middleware.isApiAuthorized,
  transactionController.deleteTransaction
);

router.get("*", viewController.notfound);
router.use(middleware.errorHandler);

module.exports = router;
