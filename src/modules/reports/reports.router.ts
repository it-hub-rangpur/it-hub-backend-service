import express from "express";
import { reportsController } from "./reports.controller";

const router = express.Router();
router.route("/").get(reportsController.getAvailableDatetime);
router.route("/test").get(reportsController.testServer);

export const reportsRouter = router;
