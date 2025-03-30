import express from "express";
import { vpsController } from "./vps.controller";

const router = express.Router();
router.route("/").get(vpsController.speedTestController);

export const vpsRouter = router;
