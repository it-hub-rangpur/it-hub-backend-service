import express from "express";
import { serverController } from "./server.controller";

const router = express.Router();
router.route("/create-session").post(serverController.createNewSession);
router.route("/mobile-verify").post(serverController.mobileVerify);
router.route("/password-verify").post(serverController.authVerify);
router
  .route("/application-submit")
  .post(serverController.applicationInfoSubmit);
router.route("/personal-submit").post(serverController.personalInfoSubmit);
router.route("/overview-submit").post(serverController.overviewInfoSubmit);

router.route("/login-otp-send").post(serverController.sendLoginOTP);
router.route("/login-otp-verify").post(serverController.verifyLoginOTP);
router.route("/logged-out").post(serverController.loggedOut);

router.route("/payment-otp-sent").post(serverController.sendPaymentOTP);
router.route("/payment-otp-verify").post(serverController.verifyPaymentOTP);
router.route("/get-slot-time").post(serverController.getSlotTime);
router.route("/pay-now").post(serverController.bookNow);
router.route("/captcha-token").post(serverController.getCaptchaToken);

export const serverRouter = router;
