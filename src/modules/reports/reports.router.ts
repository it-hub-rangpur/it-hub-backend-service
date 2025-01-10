import express from "express";
import { reportsController } from "./reports.controller";

const router = express.Router();
router.route("/").get(reportsController.getAvailableDatetime);

export const reportsRouter = router;
