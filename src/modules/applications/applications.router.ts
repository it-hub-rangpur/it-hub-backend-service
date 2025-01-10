import express from "express";
import { applicationController } from "./applications.controller";
import verifyedLoginUser from "../../middlewares/verifyedUser";

const router = express.Router();

router.route("/get-all").get(applicationController.getReadyApplications);

router
  .route("/")
  .get(verifyedLoginUser, applicationController.getAll)
  .post(verifyedLoginUser, applicationController.create);

router
  .route("/:id")
  .patch(verifyedLoginUser, applicationController.updateOne)
  .delete(verifyedLoginUser, applicationController.deleteOne)
  .get(verifyedLoginUser, applicationController.getOne);

export const applicationRouter = router;
