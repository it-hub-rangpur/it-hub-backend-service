import express from "express";
import { applicationController } from "./applications.controller";
import verifyedLoginUser from "../../middlewares/verifyedUser";

const router = express.Router();

// router.route("/get-all").get(applicationController.getReadyApplications);
router
  .route("/get-process")
  .get(verifyedLoginUser, applicationController.getReadyApplications);

router
  .route("/get-process/:id")
  .get(applicationController.getProcessApplications);

router
  .route("/")
  .get(verifyedLoginUser, applicationController.getAll)
  .post(verifyedLoginUser, applicationController.create);

router
  .route("/:id")
  .patch(verifyedLoginUser, applicationController.updateOne)
  .delete(verifyedLoginUser, applicationController.deleteOne)
  .get(verifyedLoginUser, applicationController.getOne);

router
  .route("/payment-status/:phone")
  .patch(verifyedLoginUser, applicationController.updateByPhone);

router.route("/set-slot-times").post(applicationController.setSlotDates);

export const applicationRouter = router;
