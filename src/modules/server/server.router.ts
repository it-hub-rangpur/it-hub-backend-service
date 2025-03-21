import express from "express";
import { serverController } from "./server.controller";

const router = express.Router();
router.route("/create-session/").post(serverController.createNewSession);
router.route("/login-otp-send").post(serverController.sendLoginOTP);
router.route("/login-otp-verify").post(serverController.verifyLoginOTP);
router.route("/logged-out").post(serverController.loggedOut);

export const serverRouter = router;
