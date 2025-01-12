import express from "express";
import { visaApiController } from "./visaApi.controller";

const router = express.Router();
router.route("/queue-manage").post(visaApiController.manageQueue);
router.route("/get_payment_options_v2").post(visaApiController.getTimeSlots);
router.route("/slot_pay_now").post(visaApiController.payInvoice);

export const visaApiRouter = router;
