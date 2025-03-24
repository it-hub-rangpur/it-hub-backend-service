import express from "express";
import { serverController } from "./server.controller";

const router = express.Router();
router.route("/create-session/").post(serverController.createNewSession);
router.route("/login-otp-send").post(serverController.sendLoginOTP);
router.route("/login-otp-verify").post(serverController.verifyLoginOTP);
router.route("/logged-out").post(serverController.loggedOut);
router.route("/start-process").post(serverController.startProcess);
router.route("/payment-otp-sent").post(serverController.sendPaymentOTP);
router.route("/payment-otp-verify").post(serverController.verifyPaymentOTP);
router.route("/get-slot-time").post(serverController.getSlotTime);
router.route("/pay-now").post(serverController.bookNow);
router.route("/captcha-token").post(serverController.getCaptchaToken);

export const serverRouter = router;
