import express from "express";
import { visaApiController } from "./visaApi.controller";

const router = express.Router();
router.route("/queue-manage").post(visaApiController.manageQueue);

export const visaApiRouter = router;
