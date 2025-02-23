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
  .route("/status/:id")
  .patch(verifyedLoginUser, applicationController.updateApplicatonComplete);

router
  .route("/move-to-ongoing/:id")
  .patch(verifyedLoginUser, applicationController.moveToOngoing);

router
  .route("/")
  .get(verifyedLoginUser, applicationController.getAll)
  .post(verifyedLoginUser, applicationController.create);

router
  .route("/get-all-complete")
  .get(verifyedLoginUser, applicationController.getAllCompleted);

router
  .route("/get-all-by-admin")
  .get(verifyedLoginUser, applicationController.getAllByAdmin);

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
