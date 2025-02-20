import express from "express";
import { messagesController } from "./messages.controller";

const router = express.Router();
router.route("/").get(messagesController.sendMessage);
router.route("/otp-test").get(messagesController.autoOtp);
router.route("/:phone").get(messagesController.sendAutoOtp);
router.route("/create").post(messagesController.create);
router.route("/get-all").get(messagesController.getAll);
router.route("/test").get(messagesController.testSocket);

export const messagesRouter = router;
