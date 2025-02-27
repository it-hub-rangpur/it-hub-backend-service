import express from "express";
import { visaApiController } from "./visaApi.controller";

const router = express.Router();
router.route("/queue-manage").post(visaApiController.manageQueue);
router.route("/get_payment_options_v2").post(visaApiController.getTimeSlots);
router.route("/slot_pay_now").post(visaApiController.payInvoice);

router.route("/mobile-verify").post(visaApiController.mobileVerify);
router.route("/pay-otp-sent").post(visaApiController.sendOtp);
router.route("/pay-otp-verify").post(visaApiController.verifyOtp);
router.route("/pay-slot-time").post(visaApiController.payTimeSlots);
router.route("/paynow").post(visaApiController.slotPayNow);

// new apis
router
  .route("/application-info-submit")
  .post(visaApiController.applicationInfoSubmit);

export const visaApiRouter = router;
