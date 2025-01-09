import express from "express";
import { messagesController } from "./messages.controller";

const router = express.Router();
router.route("/").get(messagesController.sendMessage);

export const messagesRouter = router;
